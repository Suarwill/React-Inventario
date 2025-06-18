#!/bin/bash

# Definir las variables del backend
DATOS_DB=$(cat <<EOF
PORT=3000
DB_USER=servidor
DB_PASSWORD=$DB_PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario
JWT_SECRET=jwtservidorclave
JWT_EXPIRATION=8h
EOF
)

# Definir la configuración de NGINX
NGINX_CONF=$(cat <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    client_max_body_size 50M;

    gzip on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; # Tipos de contenido a comprimir
    gzip_vary on; # Agregar encabezado Vary para proxies
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
)

function show_error() {
    echo "Error: $1"
    exit 1
}

function instalar_frontend() {
    echo "📦 Instalando NGINX..."
    sudo apt install -y nginx

    sudo systemctl enable nginx
    sudo systemctl start nginx

    echo "🔍 Verificando NGINX..."
    sudo nginx -t

    echo "🔄 Reiniciando NGINX..."
    sudo systemctl restart nginx
    echo "✅ NGINX está sirviendo tu frontend React."

}

function install_backend() {
    echo "📦 Inicializando proyecto Node.js..."
    npm init -y
    sudo apt update && apt install netcat-openbsd

    echo "Instalando dependencias del backend..."
    npm install express cors dotenv pg bcrypt jsonwebtoken express-validator multer csv-parser xlsx express-rate-limit || show_error "Fallo al instalar dependencias"

    # Solicitar la contraseña al usuario
    read -sp "Introduce la contraseña para el usuario PostgreSQL: " DB_PASSWORD
    echo

    echo "🔐 Creando archivo .env..."
    echo "$DATOS_DB" > .env

    echo "Archivo .env creado con éxito."

    echo "🚀 Instalando PM2 si no está presente..."
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi

    echo "🟢 Iniciando backend con PM2..."
    pm2 delete react-backend || true
    pm2 start index.js --name react-backend
    pm2 save

    echo "🔄 Configurando reinicio automático con PM2..."
    STARTUP_CMD=$(pm2 startup | tail -1)
    eval "$STARTUP_CMD"

    echo "🌐 Configurando Nginx como proxy..."

    # Eliminar el archivo anterior
    sudo rm -f /etc/nginx/sites-available/default
    sudo rm -f /etc/nginx/sites-enabled/default

    # Crear el nuevo archivo usando la configuración definida
    echo "$NGINX_CONF" | sudo tee /etc/nginx/sites-available/default > /dev/null

    # Crear enlace simbólico en sites-enabled
    sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

    echo "🔁 Reiniciando Nginx..."
    sudo nginx -t
    sudo systemctl restart nginx

    # 🔐 En sistemas con SELinux (como Rocky Linux), habilitar conexión de red para Nginx
    # sudo setsebool -P httpd_can_network_connect 1

    echo "✅ Todo listo. Backend corriendo en http://localhost:3000 y accesible públicamente vía Nginx en http://<tu-servidor>/user/"
}

function test_backend() {
    # realizando prueba del backend
    curl -X GET http://localhost:3000/

    # prueba de crear usuario
    echo "\n[ ] Realizando prueba... sin /api/"
    curl -X GET http://localhost:3000/user/search?username=admin \
        -H "Content-Type: application/json"

    echo "\n[ ] Realizando prueba... con /api/"
    curl -X GET http://localhost:3000/api/user/search?username=admin \
        -H "Content-Type: application/json"

    echo "\n[ ] Realizando prueba... con /api/api/"
    curl -X GET http://localhost:3000/api/api/user/search?username=admin \
        -H "Content-Type: application/json"

    echo "Realizando prueba de conexion a PostgreSQL..."
    # prueba de servicio del puerto 5432
    nc -zv localhost 5432
    if [ $? -eq 0 ]; then
        echo "PostgreSQL está corriendo en el puerto 5432."
    else
        echo "PostgreSQL no está corriendo en el puerto 5432."
    fi
}

function crear_admin_user() {
    # Script para crear un usuario administrador en la base de datos PostgreSQL
    read -p "Escriba la contraseña del usuario administrador: " ADMIN_PASSWORD
    curl -X POST http://localhost:3000/api/user/especialRegistro \
        -H "Content-Type: application/json" \
        -d '{
            "username": "admin",
            "password": "'$ADMIN_PASSWORD'"
        }'
}

function actualizar_backend() {
    echo "Forzando git pull..."
    git fetch --all
    git reset --hard origin/main

    echo "Actualizando el backend."
    git pull origin main

    echo "📦 Se procede a eliminar el backend y a crear uno nuevo..."
    sudo systemctl restart postgresql

    pm2 delete react-backend || true

    # Iniciar el backend sin autorestart
    pm2 start index.js --name react-backend --env production
    pm2 save

    sudo systemctl restart nginx

    curl http://localhost:3000
}

function actualizar_frontend() {
    SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
    FRONTEND_BUILD="$SCRIPT_DIR/../frontend/build"

    echo "📦 Actualizando el frontend..."
    git pull origin main

    echo "📁 Copiando archivos de build desde $FRONTEND_BUILD a /var/www/html"
    sudo mkdir -p /var/www/html
    sudo rm -rf /var/www/html/*
    sudo cp -r "$FRONTEND_BUILD/"* /var/www/html/

    echo "✅ Archivos frontend copiados con éxito."

    echo "🔁 Reiniciando NGINX..."
    sudo systemctl restart nginx
    echo "✅ NGINX Reiniciado."
}

# Salir si algo falla
set -e

while true; do

    echo "[ ] Menu de Tareas"
    echo "----------------*W*----------------"
    echo "1. Preparar Frontend"
    echo "2. Instalar dependencias Backend"
    echo "3. Crear un usuario administrador"
    echo 
    echo "4. Actualizar el Backend"
    echo "5. Actualizar el Frontend"
    echo 
    echo "7. Test del Backend y BBDD."

    echo
    echo "0. Salir"
    echo "----------------*W*----------------"

    read -p "Elige una opción: " REPLY
    case $REPLY in
        1)
            instalar_frontend
            ;;
        2)
            install_backend
            ;;
        3)
            crear_admin_user
            ;;
        4)
            actualizar_backend
            ;;
        5)
            actualizar_frontend
            ;;
        7)
            test_backend
            ;;
        0)
            echo "Saliendo..."
            exit 0
            ;;
        *)
            echo "Entrada no válida. Por favor, elija una opción del menú."
            ;;
    esac
done