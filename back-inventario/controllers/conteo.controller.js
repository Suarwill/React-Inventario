const pool = require('../db/pool');

const addConteo = async (req, res) => {
    const { tipo, cant, cod, nro_envio, usuario } = req.body;

    try {
        const query = 'INSERT INTO conteo (tipo, cant, cod, nro_envio, usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [tipo, cant, cod, nro_envio, usuario];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Conteo agregado correctamente', conteo: result.rows[0] });
    } catch (error) {
        console.error('Error al agregar el conteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getConteo = async (req, res) => {
    const { id } = req.query;

    try {
        let result;
        if (id) {
            const query = 'SELECT * FROM conteo WHERE id = $1';
            result = await pool.query(query, [id]);
        } else {
            const query = 'SELECT * FROM conteo';
            result = await pool.query(query);
        }

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Conteo no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el conteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
    getConteo,
    updateConteo,
    deleteConteo
};