#!/bin/bash
set -e

echo "📁 Copiando archivos de build a /var/www/html"
sudo rm -rf /var/www/html/*
sudo cp -r ./front-inventario/build/* /var/www/html/

echo "✅ Archivos frontend copiados con éxito."
