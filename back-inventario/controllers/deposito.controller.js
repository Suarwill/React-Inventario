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
  const { id } = req.query;
  try {
    let result;
    if (id) {
      // Obtener un deposito por ID
      result = await pool.query('SELECT * FROM depositos WHERE id = $1', [id]);
    } else {
      // Obtener todos los depositos
      result = await pool.query('SELECT * FROM depositos');
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el deposito:', error);
    res.status(500).json({ error: 'Error al obtener el deposito' });
  }
}

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