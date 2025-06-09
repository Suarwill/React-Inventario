#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Inicializando proyecto Node.js..."
npm init -y

echo "📚 Instalando dependencias..."
npm install express cors dotenv pg bcrypt jsonwebtoken express-validator multer csv-parser xlsx express-rate-limit

# Solicitar la contraseña al usuario
read -sp "Introduce la contraseña para el usuario PostgreSQL: " DB_PASSWORD
echo

echo "🔐 Creando archivo .env..."
cat > .env <<EOF
PORT=3000
DB_USER=servidor
DB_PASSWORD=$DB_PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario
JWT_SECRET=jwtservidorclave
EOF

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

# Crear el nuevo archivo
sudo tee /etc/nginx/sites-available/default > /dev/null <<'NGINX_CONF'
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
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_CONF

# Crear enlace simbólico en sites-enabled
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default


echo "🔁 Reiniciando Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 🔐 En sistemas con SELinux (como Rocky Linux), habilitar conexión de red para Nginx
# sudo setsebool -P httpd_can_network_connect 1

echo "✅ Todo listo. Backend corriendo en http://localhost:3000 y accesible públicamente vía Nginx en http://<tu-servidor>/user/"