const pool = require('../db/pool');

const addMovimiento = async (req, res) => {
  const movimientos = req.body.data; // Extraer el array de movimientos

  if (!movimientos || !Array.isArray(movimientos)) {
    return res.status(400).json({ error: 'Datos inválidos o faltantes' });
  }

  try {
    for (const movimiento of movimientos) {
      const { C: nro, M: destinoRaw, O: fecha, AH: tipo, AW: cant, AY: cod } = movimiento;
      const origen = "BODEGA";
      const destino = destinoRaw ? destinoRaw.toUpperCase() : null; // Convertir destino a mayúsculas

      console.log('>>> Agregando movimiento:', { nro, origen, destino, tipo, cant, cod, fecha });

      // Verificar si el producto existe
      const productResult = await pool.query('SELECT * FROM productos WHERE codigo = $1', [cod]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: `Producto no encontrado: ${cod}` });
      }

      // Verificar si el destino es válido
      const destinoResult = await pool.query('SELECT * FROM sectores WHERE sector = $1', [destino]);
      if (destinoResult.rows.length === 0) {
        return res.status(404).json({ error: `Destino no encontrado: ${destino}` });
      }

      // Insertar el nuevo movimiento
      await pool.query(
        'INSERT INTO movimientos (nro, origen, destino, tipo, cant, cod, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [nro, origen, destino, tipo, cant, cod, fecha]
      );
    }

    res.status(201).json({ message: 'Movimientos agregados exitosamente' });
  } catch (error) {
    console.error('Error al agregar los movimientos:', error);
    res.status(500).json({ error: 'Error al agregar los movimientos' });
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
    // Subconsulta para obtener la fecha más cercana
    const query = `
      WITH fecha_cercana AS (
        SELECT fecha
        FROM movimientos
        WHERE origen = $1 
          AND destino = $2 
          AND tipo = $3
        ORDER BY ABS(EXTRACT(EPOCH FROM (fecha - NOW()))) ASC
        LIMIT 1
      )
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
        AND movimientos.fecha = (SELECT fecha FROM fecha_cercana)
      ORDER BY movimientos.nro ASC
    `;
    const params = [origen, destino, tipo];

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron movimientos cercanos' });
    }
    console.log('>>> Cargados movimientos cercanos para el destino:', destino, ':', result.rows.length);
    res.status(200).json(result.rows); // Devolver todas las filas con la fecha más cercana
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
  const { nro } = req.params; // Obtener el número de reposición desde los parámetros
  console.log('>>> Eliminando movimientos con número:', nro);
  try {
    // Verificar si existen movimientos con el número proporcionado
    const result = await pool.query('SELECT * FROM movimientos WHERE nro = $1', [nro]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron movimientos con el número proporcionado' });
    }

    // Eliminar todas las filas que coincidan con el número de reposición
    await pool.query('DELETE FROM movimientos WHERE nro = $1', [nro]);
    res.status(200).json({ message: 'Todos los movimientos con el número proporcionado han sido eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar los movimientos:', error);
    res.status(500).json({ error: 'Error al eliminar los movimientos' });
  }
};

const getUltimosEnvios = async (req, res) => {
  const { destino } = req.query; // Recibir el destino desde el frontend
  const origen = "BODEGA"; // Origen siempre será "BODEGA"
  const tipo = "PRODUCCION"; // Tipo siempre será "PRODUCCION"

  try {
    // Subconsulta para obtener las 3 fechas más cercanas
    const query = `
      WITH fechas_cercanas AS (
        SELECT DISTINCT fecha
        FROM movimientos
        WHERE origen = $1 
          AND destino = $2 
          AND tipo = $3
        ORDER BY ABS(EXTRACT(EPOCH FROM (fecha - NOW()))) ASC
        LIMIT 3
      )
      SELECT 
        movimientos.fecha, 
        movimientos.nro, 
        movimientos.cant, 
        movimientos.cod
      FROM movimientos
      WHERE movimientos.origen = $1 
        AND movimientos.destino = $2 
        AND movimientos.tipo = $3
        AND movimientos.fecha IN (SELECT fecha FROM fechas_cercanas)
      ORDER BY movimientos.fecha DESC, movimientos.nro ASC
    `;
    const params = [origen, destino, tipo];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron envíos recientes' });
    }

    console.log('>>> Últimos envíos encontrados:', result.rows);
    res.status(200).json(result.rows); // Devolver todas las filas relacionadas a las fechas más cercanas
  } catch (error) {
    console.error('Error al obtener los últimos envíos:', error);
    res.status(500).json({ error: 'Error al obtener los últimos envíos' });
  }
};

module.exports = {
  addMovimiento,
  getMovimiento,
  updateMovimiento,
  deleteMovimiento,
  getMovimientoCercano,
  getUltimosEnvios
}