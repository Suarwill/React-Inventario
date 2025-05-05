require('dotenv').config();
const { Pool } = require('pg');

// Database Pool Configuration - variables en el .env
const pool = new Pool({
    host: process.env.DB_HOST,          // IP o 'localhost', óptimo para cloud
    user: process.env.DB_USER,          // usuario conexion a la BBDD
    password: process.env.DB_PASSWORD,  // contraseña conexion a la BBDD
    database: process.env.DB_NAME,      // Nombre de la BBDD
    port: process.env.DB_PORT,          // Puerto de la BBDD
});

module.exports = pool;