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
  const { origen, destino, tipo } = req.query;
  try {
    let query = `
      SELECT 
        movimientos.fecha, 
        movimientos.nro, 
        movimientos.cant, 
        movimientos.cod, 
        productos.descripcion
      FROM movimientos
      INNER JOIN productos ON movimientos.cod = productos.codigo
    `;
    const params = [];
    const conditions = [];

    // Agregar condiciones dinámicamente según los parámetros proporcionados
    if (origen) {
      conditions.push('movimientos.origen = $' + (conditions.length + 1));
      params.push(origen);
    }
    if (destino) {
      conditions.push('movimientos.destino = $' + (conditions.length + 1));
      params.push(destino);
    }
    if (tipo) {
      conditions.push('movimientos.tipo = $' + (conditions.length + 1));
      params.push(tipo);
    }

    // Si hay condiciones, agregarlas al query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el movimiento:', error);
    res.status(500).json({ error: 'Error al obtener el movimiento' });
  }
};

const getMovimientoCercano = async (req, res) => {
  const { destino } = req.query; // El destino se envía desde el frontend
  const origen = "BODEGA";
  const tipo = "PRODUCCION";

  try {
    const query = `
      SELECT 
        movimientos.fecha, 
        movimientos.nro, 
        movimientos.cant, 
        movimientos.cod, 
        productos.descripcion
      FROM movimientos
      INNER JOIN productos ON movimientos.cod = productos.codigo
      WHERE movimientos.origen = $1 
        AND movimientos.destino = $2 
        AND movimientos.tipo = $3
      ORDER BY ABS(EXTRACT(EPOCH FROM (movimientos.fecha - NOW()))) ASC
      LIMIT 1
    `;
    const params = [origen, destino, tipo];

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron movimientos cercanos' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el movimiento más cercano:', error);
    res.status(500).json({ error: 'Error al obtener el movimiento más cercano' });
  }
};

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
  deleteMovimiento,
  getMovimientoCercano
}