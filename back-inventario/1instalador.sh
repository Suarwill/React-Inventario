#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Inicializando proyecto Node.js..."
npm init -y

echo "📚 Instalando dependencias..."
npm install express cors dotenv pg bcrypt jsonwebtoken express-validator

echo "🔐 Creando archivo .env..."
cat > .env <<'EOF'
PORT=3000
DB_USER=nOmBrE
DB_PASSWORD=cOnTrAsEnA
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombreTABLA
JWT_SECRET=jwtservidorclave
EOF

echo "🚀 Instalando PM2 si no está presente..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "🟢 Iniciando backend con PM2..."
pm2 start index.js --name react-backend
pm2 save

echo "🔄 Configurando reinicio automático con PM2..."
STARTUP_CMD=$(pm2 startup | tail -1)
eval "$STARTUP_CMD"

echo "🌐 Configurando Nginx como proxy..."

sudo tee /etc/nginx/sites-enable/default > /dev/null <<'NGINX_CONF'
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
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

sudo tee /etc/nginx/sites-available/default > /dev/null <<'NGINX_CONF'
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
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

echo "🔁 Reiniciando Nginx..."
sudo systemctl restart nginx

echo "🔥 Abriendo puerto 80 en el firewall..."
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

# 🔐 En sistemas con SELinux (como Rocky Linux), habilitar conexión de red para Nginx
# sudo setsebool -P httpd_can_network_connect 1

echo "✅ Todo listo. Backend corriendo en http://localhost:3000 y accesible públicamente vía Nginx en http://<tu-servidor>/user/"