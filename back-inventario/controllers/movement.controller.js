const pool = require('../db/pool');

const addMovimiento = async (req, res) => {
  const { nro, origen, destino, tipo, cant, cod } = req.body;
  try {
    // Verificar si el producto existe
    const productResult = await pool.query('SELECT * FROM productos WHERE id = $1', [cod]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Verificar si el origen y destino son válidos
    const origenResult = await pool.query('SELECT * FROM sectores WHERE id = $1', [origen]);
    const destinoResult = await pool.query('SELECT * FROM sectores WHERE id = $1', [destino]);
    if (origenResult.rows.length === 0) {
      return res.status(404).json({ error: 'Origen no encontrado' });
    }
    if (destinoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' });
    }
    // Insertar el nuevo movimiento
    const result = await pool.query(
      'INSERT INTO movimientos (nro, origen, destino, tipo, cant, cod) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nro, origen, destino, tipo, cant, cod]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar el movimiento:', error);
    res.status(500).json({ error: 'Error al agregar el movimiento' });
  }
}

const getMovimiento = async (req, res) => {
  const { nro } = req.query;
  try {
    let result;
    if (nro) {
      // Obtener un movimiento por ID
      result = await pool.query('SELECT * FROM movimientos WHERE nro = $1', [nro]);
    } else {
      // Obtener todos los movimientos
      result = await pool.query('SELECT * FROM movimientos');
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el movimiento:', error);
    res.status(500).json({ error: 'Error al obtener el movimiento' });
  }
}
const updateMovimiento = async (req, res) => {
  const { id } = req.params;
  const { nro, origen, destino, tipo, cant, cod } = req.body;
  try {
    // Verificar si el movimiento existe
    const result = await pool.query('SELECT * FROM movimientos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    // Actualizar el movimiento
    const updatedResult = await pool.query(
      'UPDATE movimientos SET nro = $1, origen = $2, destino = $3, tipo = $4, cant = $5, cod = $6 WHERE id = $7 RETURNING *',
      [nro, origen, destino, tipo, cant, cod, id]
    );
    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el movimiento:', error);
    res.status(500).json({ error: 'Error al actualizar el movimiento' });
  }
}

const deleteMovimiento = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el movimiento existe
    const result = await pool.query('SELECT * FROM movimientos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    // Eliminar el movimiento
    await pool.query('DELETE FROM movimientos WHERE id = $1', [id]);
    res.status(200).json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el movimiento:', error);
    res.status(500).json({ error: 'Error al eliminar el movimiento' });
  }
};

module.exports = {
  addMovimiento,
  getMovimiento,
  updateMovimiento,
  deleteMovimiento
}