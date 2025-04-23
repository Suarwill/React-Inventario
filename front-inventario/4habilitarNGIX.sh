#!/bin/bash

set -e

echo "📦 Instalando NGINX..."
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

NGINX_CONF="/etc/nginx/conf.d/react_frontend.conf"

echo "🛠️ Configurando NGINX para servir React..."
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name localhost;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOF

echo "🔍 Verificando NGINX..."
sudo nginx -t

echo "🔄 Reiniciando NGINX..."
sudo systemctl restart nginx

echo "✅ NGINX listo para servir tu frontend React."
