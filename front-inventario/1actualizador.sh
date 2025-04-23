#!/bin/bash
set -e

# Actualiza paquetes
sudo dnf update -y

# Instala Node.js (usaremos Node 18 como ejemplo)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs git

node -v
npm -v

echo "📁 Copiando archivos de build a /var/www/html"
sudo rm -rf /var/www/html/*
sudo cp -r ./front-inventario/build/* /var/www/html/

echo "✅ Archivos frontend copiados con éxito."
