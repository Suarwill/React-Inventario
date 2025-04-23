#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Inicializando proyecto Node.js..."
npm init -y

echo "📚 Instalando dependencias..."
npm install express cors dotenv

echo "📝 Creando archivo index.js..."
cat > index.js <<'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: '¡Hola desde el backend!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
EOF

echo "🔐 Creando archivo .env..."
echo "PORT=5000" > .env

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

echo "✅ Todo listo. Backend corriendo y configurado con PM2 para arrancar al iniciar el sistema."
