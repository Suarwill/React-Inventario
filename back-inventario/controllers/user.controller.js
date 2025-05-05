const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');


// Registrar usuario
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login usuario
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Buscar usuarios
const searchUsers = async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Falta el username' });

  try {
    const result = await pool.query('SELECT id, username FROM usuarios WHERE username ILIKE $1', [`%${username}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: 'Error al buscar usuario' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE username = $1 RETURNING id', [username]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: `Usuario '${username}' eliminado` });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  searchUsers,
  deleteUser
};