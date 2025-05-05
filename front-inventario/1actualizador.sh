#!/bin/bash
set -e

echo "📁 Copiando archivos de build a /var/www/html"
sudo mkdir -p /var/www/html
sudo rm -rf /var/www/html/*
sudo cp -r ./build/* /var/www/html/

echo "✅ Archivos frontend copiados con éxito."

sudo systemctl restart nginx
echo "NGINX Reiniciado."