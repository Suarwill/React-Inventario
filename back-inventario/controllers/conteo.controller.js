const pool = require('../db/pool');

const addConteo = async (req, res) => {
    const verificaciones = req.body;

    console.log('Datos recibidos desde el cliente:', req.body.usuario);

    try {
        for (const verificacion of verificaciones) {
            if (!verificacion.tipo || !verificacion.cant || !verificacion.cod || !verificacion.nro_envio || !verificacion.usuario) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const { tipo, cant, cod, nro_envio, usuario } = verificacion;
            const query = 'INSERT INTO conteos (tipo, cant, cod, nro_envio, usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [tipo, cant, cod, nro_envio, usuario];

            const result = await pool.query(query, values);
        };
        res.status(200).json({ message: 'Se han agregado las verificaciones correctamente' });
    } catch (error) {
        console.error('Error al agregar el conteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getConteos = async (req, res) => {
    const { nro } = req.query;

    try {
        // Validar el parámetro nro
        if (nro && isNaN(nro)) {
            return res.status(400).json({ error: 'El parámetro nro debe ser un número válido' });
        }

        let result;
        if (nro) {
            const query = 'SELECT * FROM conteos WHERE nro_envio = $1';
            result = await pool.query(query, [nro]);
        } else {
            const query = 'SELECT * FROM conteos';
            result = await pool.query(query);
        }

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Conteo no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el conteo:', error);

        // Identificar si el error es de la base de datos
        if (error.code === '42P01') { // Código de error para tabla inexistente en PostgreSQL
            res.status(500).json({ error: 'La tabla conteo no existe en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

const updateConteo = async (req, res) => {
    const { id } = req.params;
    const { tipo, cant, cod, nro_envio, usuario } = req.body;

    try {
        const query = 'UPDATE conteo SET tipo = $1, cant = $2, cod = $3, nro_envio = $4, usuario = $5 WHERE id = $6 RETURNING *';
        const values = [tipo, cant, cod, nro_envio, usuario, id];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Conteo actualizado correctamente', conteo: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Conteo no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el conteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteConteo = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM conteo WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Conteo eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Conteo no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el conteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    addConteo,
    getConteos,
    updateConteo,
    deleteConteo
};