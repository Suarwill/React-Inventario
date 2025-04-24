#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Inicializando proyecto Node.js..."
npm init -y

echo "📚 Instalando dependencias..."
npm install express cors dotenv pg bcrypt jsonwebtoken


echo "🔐 Creando archivo .env..."
cat > .env <<'EOF'
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario
JWT_SECRET=tu_clave_secreta
EOF

echo "🚀 Instalando PM2 si no está presente..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "🟢 Iniciando backend con PM2..."
pm2 start index.js --name react-backend

echo "💾 Guardando proceso PM2..."
pm2 save

echo "🔄 Configurando reinicio automático con PM2..."
STARTUP_CMD=$(pm2 startup | tail -1)
eval "$STARTUP_CMD"

sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
sudo setsebool -P httpd_can_network_connect 1
sudo systemctl restart nginx

pm2 restart react-backend

echo "✅ Todo listo. Backend corriendo y configurado con PM2 para arrancar al iniciar el sistema."
