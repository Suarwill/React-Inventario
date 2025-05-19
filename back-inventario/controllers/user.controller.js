const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
const registerUser = async (req, res) => {
  console.log("Registering user:", req.body);
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  console.log("Validation errors:", errors);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, sector, zona } = req.body; // Agregar sector y zona
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, sector, zona) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, sector, zona] // Incluir sector y zona en la consulta
    );
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const loginUser = async (req, res) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, username, password, sector, zona FROM usuarios WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Crear el token JWT
    const token = jwt.sign(
      { userId: usuario.id, username: usuario.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // Devolver la respuesta con el token, la información del usuario, sector y zona
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        sector: usuario.sector,
        zona: usuario.zona
      }
    });
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

// Editar usuario
const updateUser = async (req, res) => {
  const { username } = req.params;
  const { newUsername, newPassword, newSector, newZona } = req.body; // Agregar sector y zona

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (newUsername) {
      updates.push(`username = $${paramIndex++}`);
      params.push(newUsername);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.push(`password = $${paramIndex++}`);
      params.push(hashedPassword);
    }

    if (newSector) {
      updates.push(`sector = $${paramIndex++}`);
      params.push(newSector);
    }

    if (newZona) {
      updates.push(`zona = $${paramIndex++}`);
      params.push(newZona);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
    }

    params.push(username);
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE username = $${paramIndex} RETURNING *`;
    const updatedResult = await pool.query(query, params);

    res.json({ message: 'Usuario actualizado correctamente.', user: updatedResult.rows[0] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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
  updateUser,
  deleteUser
};