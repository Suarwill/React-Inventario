require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

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
app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token JWT si es necesario
    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    res.json({ message: 'Login exitoso', token }); // puedes incluir el token JWT en la respuesta
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

app.post('/user/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    const usuario = result.rows[0];

    res.json({ message: 'Registro exitoso', usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

app.get('/user/search', async (req, res) => {
  const { username } = req.query;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    const usuarios = result.rows;
    res.json(usuarios);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

app.post('/userdelete', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE username = $1', [username]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});