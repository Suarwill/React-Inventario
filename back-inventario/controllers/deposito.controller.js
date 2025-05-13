const pool = require('../db/pool');

const addDeposito = async (req, res) => {
  const { usuario, fecha, monto, comentario } = req.body;
  try {
    // Verificar si el usuario existe
    const userResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Insertar el nuevo deposito
    const result = await pool.query(
      'INSERT INTO depositos (usuario, fecha, monto, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario, fecha, monto, comentario]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar el deposito:', error);
    res.status(500).json({ error: 'Error al agregar el deposito' });
  }
}

const getDeposito = async (req, res) => {
  const { usuario } = req.query;

  try {
    if (!usuario) {
      return res.status(400).json({ error: 'Debe proporcionar un ID de usuario' });
    }

    // Obtener el sector del usuario
    const { rows: sectorData } = await pool.query(
      'SELECT sector FROM usuarios WHERE id = $1',
      [usuario]
    );

    if (sectorData.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const sector = sectorData[0].sector;

    // Buscar los últimos 20 depósitos del usuario
    const { rows: userDeposits } = await pool.query(
      'SELECT * FROM depositos WHERE usuario = $1 ORDER BY fecha DESC LIMIT 20',
      [usuario]
    );

    if (userDeposits.length > 0) {
      return res.status(200).json(userDeposits);
    }

    // Si no tiene depósitos, buscar los últimos 20 depósitos del mismo sector (excluyendo al usuario)
    const { rows: sectorDeposits } = await pool.query(
      `SELECT * FROM depositos 
       WHERE usuario IN (
         SELECT id FROM usuarios 
         WHERE sector = $1 AND id != $2
       )
       ORDER BY fecha DESC
       LIMIT 20`,
      [sector, usuario]
    );

    res.status(200).json(sectorDeposits);
  } catch (error) {
    console.error('Error al obtener el depósito:', error);
    res.status(500).json({ error: 'Error al obtener el depósito' });
  }
};


const updateDeposito = async (req, res) => {
  const { id } = req.params;
  const { usuario, fecha, monto, comentario } = req.body;
  try {
    // Verificar si el deposito existe
    const result = await pool.query('SELECT * FROM depositos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deposito no encontrado' });
    }
    // Actualizar el deposito
    const updatedResult = await pool.query(
      'UPDATE depositos SET usuario = $1, fecha = $2, monto = $3, comentario = $4 WHERE id = $5 RETURNING *',
      [usuario, fecha, monto, comentario, id]
    );
    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el deposito:', error);
    res.status(500).json({ error: 'Error al actualizar el deposito' });
  }
}
const deleteDeposito = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el deposito existe
    const result = await pool.query('SELECT * FROM depositos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deposito no encontrado' });
    }
    // Eliminar el deposito
    await pool.query('DELETE FROM depositos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el deposito:', error);
    res.status(500).json({ error: 'Error al eliminar el deposito' });
  }
}
// Exportar las funciones

module.exports = {
    addDeposito,
    getDeposito,
    updateDeposito,
    deleteDeposito
};