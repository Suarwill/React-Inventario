require('dotenv').config();
const { Pool } = require('pg');

// Verificar que las variables de entorno estén definidas
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
    console.error('Faltan variables de entorno para la conexión a la base de datos');
    process.exit(1); // Terminar el proceso si hay un error crítico
}

let pool;

try {
    // Crear el pool de conexiones
    pool = new Pool({
        host: process.env.DB_HOST,          // IP o 'localhost', óptimo para cloud
        user: process.env.DB_USER,          // Usuario conexión a la BBDD
        password: process.env.DB_PASSWORD,  // Contraseña conexión a la BBDD
        database: process.env.DB_NAME,      // Nombre de la BBDD
        port: process.env.DB_PORT,          // Puerto de la BBDD
    });

    // Evento de conexión exitosa
    pool.on('connect', () => {
        console.log('Conexión a la base de datos establecida correctamente');
    });

    // Evento de error en la conexión
    pool.on('error', (err) => {
        console.error('Error en la conexión a la base de datos:', err.message);
    });
} catch (error) {
    console.error('Error al crear el pool de conexiones:', error.message);
    process.exit(1); // Terminar el proceso si hay un error crítico
}

module.exports = pool;