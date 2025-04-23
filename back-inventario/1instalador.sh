#!/bin/bash

# Salir si algo falla
set -e

echo "📦 Inicializando proyecto Node.js..."
npm init -y

echo "📚 Instalando dependencias..."
npm install express cors dotenv pg bcrypt jsonwebtoken

echo "📝 Creando archivo index.js..."
cat > index.js <<'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Ruta para pruebas
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

// Ruta para login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token JWT si es necesario
    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'Login exitoso', token }); // puedes incluir el token JWT en la respuesta
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
EOF

echo "🔐 Creando archivo .env..."
cat > .env <<'EOF'
PORT=5000
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

echo "✅ Todo listo. Backend corriendo y configurado con PM2 para arrancar al iniciar el sistema."
