const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para login
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
      if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
  
      const usuario = result.rows[0];
  
      // Validando contraseña
      const valid = await bcrypt.compare(password, usuario.password);
      if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
  
      // Generar token JWT
      const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  
      res.json({ message: 'Login exitoso', token }); // incluiyendo el token JWT en la respuesta
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: 'Error de servidor' });
    }
  });
  
  // Ruta para registrar usuarios de la aplicación
  app.post('/user/register', async (req, res) => {
    const { username, password } = req.body;
  
    /* Prueba de lectura del env 
    console.log("Database connection details:");
    console.log("  Host:", process.env.DB_HOST);
    console.log("  Port:", process.env.DB_PORT);
    console.log("  User:", process.env.DB_USER);
    console.log("  Database:", process.env.DB_NAME);
    console.log("  Password Used:", process.env.DB_PASSWORD ? "Yes (from env)" : "No");
    */
  
    try {
      // hasheando la contraseña a guardar
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );
  
      res.status(201).json({
        message: 'Usuario registrado con éxito',
        user: result.rows[0]
      });
    } catch (err) {
      console.error(err);
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
      const result = await pool.query('SELECT id, username FROM usuarios WHERE username ILIKE $1', [`%${username}%`]);
      const usuarios = result.rows;
      res.json(usuarios);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: 'Error de servidor al buscar usuarios' });
    }
  });
  
  app.delete('/user/:username', async (req, res) => {
    const { username } = req.params;
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

module.exports = router;
