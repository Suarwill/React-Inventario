const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const searchUser = async (username) => {
    if (!username) throw new Error('Falta el username');
    const newUsername = username.toUpperCase();
    const result = await pool.query('SELECT id, username FROM usuarios WHERE username ILIKE $1', [`%${newUsername}%`]);
    return result.rows;
};

const deleteUser = async (username) => {
    if (!username) throw new Error('Falta el username');
    const newUsername = username.toUpperCase();
    const result = await pool.query('DELETE FROM usuarios WHERE username = $1 RETURNING id', [newUsername]);
    return result.rows;
};

const registroEspecialUser = async (username, password) => {
    const sector = 'ADMINISTRACION';
    const zona = 'ADM';

    if (username.toUpperCase() !== 'ADMIN') {
        throw new Error('El usuario debe ser "admin"');
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
        'SELECT * FROM usuarios WHERE username = $1', [username.toUpperCase()]
    );
    if (existingUser.rows.length > 0) {
        throw new Error('El usuario ya existe');
    }

    // Insertar el nuevo usuario
    const result = await pool.query(
        'INSERT INTO usuarios (username, password, sector, zona) VALUES ($1, $2, $3, $4) RETURNING *',
        [username.toUpperCase(), hashedPassword, sector, zona]
    );

    if (result.rows.length === 0) {
        throw new Error('Error al registrar usuario');
    }

    return result.rows[0];
};

module.exports = { 
    searchUser,
    deleteUser,
    registroEspecialUser
};