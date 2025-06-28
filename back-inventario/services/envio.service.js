const pool = require('../db/pool');

const cargarMermas = async (mermas, token) => {
    const fecha = new Date();
    const nro = `${fecha.getFullYear().toString().slice(-1)}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}${String(fecha.getHours()).padStart(2, '0')}${String(fecha.getMinutes()).charAt(0)}`; // Formato: última cifra del año, mes, día, hora, primera cifra del minuto
    const origen = token.sector; // Extraer origen del token
    const destino = 'BODEGA'; // Destino fijo
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        for (const merma of mermas) {
            const { codigo, cantidad, tipo } = merma; // Extraer datos de las columnas
            const query = `
                INSERT INTO movimientos (nro, fecha, origen, destino, tipo, cant, cod)
                SELECT $1, $2, $3, $4, $5, $6, p.codigo
                FROM productos p
                WHERE p.codigo = $7
            `;
            const values = [nro, fecha.toISOString().split('T')[0], origen, destino, tipo, cantidad, codigo];
            await client.query(query, values);
        }

        await client.query('COMMIT'); // Confirmar transacción
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al cargar mermas:', error);
        throw error;
    } finally {
        client.release(); // Liberar conexión
    }
};

module.exports = {
    cargarMermas
};
