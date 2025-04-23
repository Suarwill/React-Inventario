#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Instalando dependencias de React..."
npm install

echo "🔨 Generando build de producción..."
npm run build

echo "📁 Copiando archivos de build a /var/www/html (reemplazando lo anterior)..."
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

echo "✅ Frontend actualizado y en producción."
