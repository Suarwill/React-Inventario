const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });

  let { username, password, sector, zona } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 15); // Aumentar el costo de hashing a 15 para mayor seguridad
    
    // Verificar si el usuario ya existe
    let newUsername = username.toUpperCase();
    let newSector = sector.toUpperCase();
    let newZona = zona.toUpperCase();
    username = newUsername;
    sector = newSector;
    zona = newZona;
    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    // Insertar el nuevo usuario
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, sector, zona) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, sector, zona] // Incluir sector y zona en la consulta
    );
    // Verificar si se insertó correctamente
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Error al registrar usuario' });
    }
    // Log para verificar el registro
    console.log("Usuario registrado:", username);
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const registroEspecialUser = async (req, res) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });
  
  const sector = 'ADMINISTRACION';
  const zona = 'ADM';
  let { username, password } = req.body;

  let newUsername = username.toUpperCase();
  username = newUsername;

  if ( !username === 'ADMIN') {
    return res.status(400).json({ error: 'El usuario debe ser "admin"' });  
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 15); // Aumentar el costo de hashing a 15 para mayor seguridad
    
    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    // Insertar el nuevo usuario
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, sector, zona) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, sector, zona] // Incluir sector y zona en la consulta
    );
    // Verificar si se insertó correctamente
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Error al registrar usuario' });
    }
    // Log para verificar el registro
    console.log("Usuario registrado:", username);
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

const loginUser = async (req, res) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });
  
  let { username, password } = req.body;
  try {
    let newUsername = username.toUpperCase();
    username = newUsername;
    const result = await pool.query(
      'SELECT id, username, password, sector, zona FROM usuarios WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const valid = await bcrypt.compare(password, usuario.password);
    console.log('Usuario intentando ingresar:', username);
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

const searchUsers = async (req, res) => {
  let { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Falta el username' });

  try {
    let newUsername = username.toUpperCase();
    username = newUsername;
    const result = await pool.query('SELECT id, username FROM usuarios WHERE username ILIKE $1', [`%${username}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: 'Error al buscar usuario' });
  }
};

const updateUser = async (req, res) => {
  let { username } = req.params;
  let newUser = username.toUpperCase();
  username = newUser;

  let { newUsername, newPassword, newSector, newZona } = req.body; // Agregar sector y zona
  let upperUsername = newUsername.toUpperCase();
  let upperSector = newSector.toUpperCase();
  let upperZona = newZona.toUpperCase();
  newUsername = upperUsername;
  newSector = upperSector;
  newZona = upperZona;

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

const deleteUser = async (req, res) => {
  let { username } = req.params;
  let upperUsername = username.toUpperCase();
  username = upperUsername;

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
  registroEspecialUser,
  loginUser,
  searchUsers,
  updateUser,
  deleteUser
};