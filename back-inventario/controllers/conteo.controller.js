const pool = require('../db/pool');

const addConteo = async (req, res) => {
    const { tipo, cant, cod, nro_envio , usuario } = req.body;
    
    try {
        const query = 'INSERT INTO conteo (tipo, cant, cod, nro_envio, usuario) VALUES (?, ?, ?, ?, ?)';
        const values = [tipo, cant, cod, nro_envio, usuario];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error inserting conteo:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.affectedRows > 0) {
                res.status(201).json({ message: 'Conteo added successfully' });
            } else {
                res.status(400).json({ message: 'Failed to add conteo' });
            }
        }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getConteo = async (req, res) => {
    const { id } = req.query;
    try {
        const query = 'SELECT * FROM conteo WHERE id = ?';
        const values = [id];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error fetching conteo:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ message: 'Conteo not found' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateConteo = async (req, res) => {
    const { id, tipo, cant, cod, nro_envio , usuario } = req.body;
    
    try {
        const query = 'UPDATE conteo SET tipo = ?, cant = ?, cod = ?, nro_envio = ?, usuario = ? WHERE id = ?';
        const values = [tipo, cant, cod, nro_envio, usuario, id];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error updating conteo:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Conteo updated successfully' });
            } else {
                res.status(404).json({ message: 'Conteo not found' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteConteo = async (req, res) => {
    const { id } = req.params;
    
    try {
        const query = 'DELETE FROM conteo WHERE id = ?';
        const values = [id];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error deleting conteo:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Conteo deleted successfully' });
            } else {
                res.status(404).json({ message: 'Conteo not found' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addConteo,
    getConteo,
    updateConteo,
    deleteConteo
};