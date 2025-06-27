const pool = require('../db/pool');
const csv = require('csv-parser');
const fs = require('fs');

const buscarProducto = async (cod) => {
    upperCod = cod.toUpperCase();
    result = await pool.query(
        'SELECT * FROM productos WHERE codigo = $1', [upperCod]);
    return result.rows;
};

const eliminarProducto = async (cod) => {
    upperCod = cod.toUpperCase();
    result = await pool.query(
        'DELETE FROM productos WHERE codigo = $1', [upperCod]);
    return result.rows;
}

const actualizarConCSV = (filePath) => new Promise((resolve, reject) => {
    const productos = [];
    fs.createReadStream(filePath)
        .pipe(csv({
            separator: ';',
            headers: false
        })) // Especificar el separador como ";" y sin cabeceras
        .on('data', (row) => {
            const codigo = row[0]?.trim().toString().toUpperCase();
            const descripcion = row[1]?.trim().toUpperCase();
            const categoria = row[2]?.trim().toUpperCase();
            const estatus = row[3]?.trim().toUpperCase();

            // Validaciones
            if (codigo && codigo.length <= 10 && descripcion && categoria && estatus) {
                productos.push([codigo, descripcion, categoria, estatus]);
            } else {
                console.warn('Fila del CSV ignorada por datos inválidos:', row);
            }
        })
        .on('error', (error) => {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error al eliminar el archivo temporal:', unlinkErr);
            });
            reject(error);
        })
        .on('end', async () => {
            console.log('Total de productos procesados desde CSV:', productos.length);
            if (productos.length === 0) {
                fs.unlinkSync(filePath);
                return resolve({ message: 'No se encontraron productos válidos para procesar en el archivo.' });
            }

            const client = await pool.connect();
            try {
                const query = `
                    INSERT INTO productos (codigo, descripcion, categoria, estatus)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (codigo) DO UPDATE SET
                        descripcion = EXCLUDED.descripcion,
                        categoria = EXCLUDED.categoria,
                        estatus = EXCLUDED.estatus
                `;
                await client.query('BEGIN');
                for (const producto of productos) {
                    await client.query(query, producto);
                }
                await client.query('COMMIT');
                resolve({ message: 'Productos actualizados con éxito desde CSV.' });
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error al insertar productos:', error);
                reject(error);
            } finally {
                client.release();
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error al eliminar el archivo temporal:', unlinkErr);
                });
            }
        });
});

module.exports = {
    buscarProducto,
    eliminarProducto,
    actualizarConCSV
};