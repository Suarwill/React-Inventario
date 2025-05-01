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

// Database Pool Configuration - Uses environment variables
// It correctly uses DB_USER from .env and does NOT specify a password field.
const pool = new Pool({
  host: process.env.DB_HOST,       // e.g., 'localhost' or IP address
  user: process.env.DB_USER,       // e.g., 'inventory_app_user'
  database: process.env.DB_NAME,   // e.g., 'inventory_db'
  port: process.env.DB_PORT,       // e.g., 5432
  // No 'password' field here, relying on passwordless DB auth setup
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
    // Password comparison still happens for the *application* user login,
    // not the database connection itself.
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token JWT si es necesario
    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ message: 'Login exitoso', token }); // puedes incluir el token JWT en la respuesta
  } catch (err) {
    console.error("Login error:", err); // Added more context to log
    res.status(500).json({ error: 'Error de servidor' });
  }
});

// Ruta para registrar usuarios de la aplicación
app.post('/user/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }
  console.log(process.env.DB_USER)

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'El nombre de usuario ya existe' }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING id, username', [username, hashedPassword]);
    const usuario = result.rows[0];

    res.status(201).json({ message: 'Registro exitoso', usuario }); // 201 Created
  } catch (err) {
    console.error("Register error:", err); // Added more context to log
    // Check for specific DB errors if needed, e.g., unique constraint violation
    res.status(500).json({ error: 'Error de servidor al registrar usuario' });
  }
});

// Ruta para buscar usuarios (ejemplo, podría necesitar autenticación/autorización)
app.get('/user/search', async (req, res) => {
  const { username } = req.query;
  if (!username) {
      return res.status(400).json({ error: 'Se requiere un nombre de usuario para buscar' });
  }
  try {
    // Select only non-sensitive data
    const result = await pool.query('SELECT id, username FROM usuarios WHERE username ILIKE $1', [`%${username}%`]); // Use ILIKE for case-insensitive search
    const usuarios = result.rows;
    res.json(usuarios);
  } catch (err) {
    console.error("Search error:", err); // Added more context to log
    res.status(500).json({ error: 'Error de servidor al buscar usuarios' });
  }
});

// Ruta para eliminar usuarios (ejemplo, debería tener fuerte autenticación/autorización)
// Changed endpoint to be more RESTful: DELETE /user/:username
// Note: Using username in URL might be less secure than using ID if usernames are guessable.
// Consider using DELETE /user/:id if IDs are known/used.
// IMPORTANT: Add authentication middleware here to ensure only authorized users can delete.
app.delete('/user/:username', async (req, res) => {
  const { username } = req.params; // Get username from URL parameter
  try {
    // Check if user exists before deleting
    const findResult = await pool.query('SELECT id FROM usuarios WHERE username = $1', [username]);
    if (findResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' }); // 404 Not Found
    }

    const result = await pool.query('DELETE FROM usuarios WHERE username = $1 RETURNING id', [username]);

    if (result.rowCount > 0) {
        res.json({ message: `Usuario '${username}' eliminado exitosamente` });
    } else {
        // Should not happen due to the check above, but good practice
        res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
    }
  } catch (err) {
    console.error("Delete error:", err); // Added more context to log
    res.status(500).json({ error: 'Error de servidor al eliminar usuario' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Database connection details:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  Password Used: ${process.env.PGPASSWORD || process.env.DB_PASSWORD ? 'Yes (from env)' : 'No'}`); // Check common env vars
});

// Basic error handling middleware (optional but good practice)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send('Algo salió mal!');
});
