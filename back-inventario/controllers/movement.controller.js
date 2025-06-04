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
    
      // Verificar si el producto existe
      const productResult = await pool.query('SELECT * FROM productos WHERE codigo = $1', [cod]);
      if (productResult.rows.length === 0) {
        console.log(`>>> Producto no encontrado: ${cod}`);
        let nuevoDescripcion = '->-<- Producto nuevo: Agregar descripcion';
        await pool.query('INSERT INTO productos (codigo, descripcion) VALUES ($1, $2)', [cod, nuevoDescripcion]);
        console.log(`>>> Producto no encontrado en sistema, y se ha agregado: ${cod}`);
      }

      // Verificar si el destino es válido, sino crearlo
      const destinoResult = await pool.query('SELECT * FROM sectores WHERE sector = $1', [destino]);
      if (destinoResult.rows.length === 0) {
        console.log(`>>> Sector no encontrado: ${destino}. Creando nuevo sector.`);
        await pool.query('INSERT INTO sectores (sector) VALUES ($1)',[destino]);
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

  console.log('>>> Obteniendo últimos envíos para el destino:', destino, 'con origen:', origen, 'y tipo:', tipo);

  try {
    // Subconsulta para obtener las 3 fechas más cercanas
    const queryFechas = `
      WITH fechas_cercanas AS (
        SELECT fecha
        FROM movimientos
        WHERE origen = $1 
          AND destino = $2 
          AND tipo = $3
        ORDER BY ABS(EXTRACT(EPOCH FROM (fecha - NOW()))) ASC
        LIMIT 3
      )
      SELECT fecha FROM fechas_cercanas
    `;
    const paramsFechas = [origen, destino, tipo];
    const fechasResult = await pool.query(queryFechas, paramsFechas);

    if (fechasResult.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron envíos recientes' });
    }

    const fechas = fechasResult.rows.map(row => row.fecha);

    // Obtener movimientos.nro asociados a las fechas
    const queryMovimientos = `
      SELECT nro, fecha, cod, cant
      FROM movimientos
      WHERE origen = $1 
        AND destino = $2 
        AND tipo = $3
        AND fecha = ANY($4::timestamp[])
    `;
    const paramsMovimientos = [origen, destino, tipo, fechas];
    const movimientosResult = await pool.query(queryMovimientos, paramsMovimientos);

    if (movimientosResult.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron movimientos asociados a las fechas' });
    }

    const movimientos = movimientosResult.rows;

    // Juntar las tablas movimientos y conteos, agrupar por código y sumar cantidades
    const queryConteos = `
      SELECT 
        m.fecha,
        m.nro AS nro_envio,
        COALESCE(m.cod, c.cod) AS codigo,
        SUM(COALESCE(m.cant, 0)) AS enviados,
        SUM(COALESCE(c.cant, 0)) AS recibidos
      FROM movimientos m
      FULL OUTER JOIN conteos c ON m.nro = c.nro_envio AND m.cod = c.cod
      WHERE m.nro = ANY($1::int[])
      GROUP BY m.fecha, m.nro, COALESCE(m.cod, c.cod)
      ORDER BY m.fecha DESC, m.nro ASC
    `;
    const paramsConteos = [movimientos.map(mov => mov.nro)];
    const conteosResult = await pool.query(queryConteos, paramsConteos);

    if (conteosResult.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron conteos asociados a los movimientos' });
    }

    console.log('>>> Últimos envíos encontrados para:', destino, ':', conteosResult.rows.length);
    res.status(200).json(conteosResult.rows); // Devolver todas las filas encontradas
  } catch (error) {
    console.error('Error al obtener los últimos envíos:', error);
    res.status(500).json({ error: 'Error al obtener los últimos envíos' });
  }
};

const addInventarioAV = async (req, res) => {
  const inventarios = req.body.data; // Extraer el array de inventarios
  console.log('>>> Agregando inventarios:', req.body.usuario);
  if (!inventarios || !Array.isArray(inventarios)) {
    return res.status(400).json({ error: 'Datos inválidos o faltantes' });
  }
  try {
    for (const inventario of inventarios) {
      const { tipo_dif, usuario, fecha, codigo, stock, fisico  } = inventario;
      query = `
        INSERT INTO diferencia_inv (tipo_dif, usuario, fecha, codigo, stock, fisico)
        VALUES ($1, $2, $3, $4, $5, $6)`;
      const params = [tipo_dif, usuario, fecha, codigo, stock, fisico];
      await pool.query(query, params);
      console.log('>>> Inventario agregado:', query);
    }
    console.log('>>> Inventarios agregados exitosamente:', inventarios.length);
    res.status(201).json({ message: 'Inventarios agregados exitosamente' });
  } catch (error) {
    console.error('Error al agregar los inventarios:', error);
    res.status(500).json({ error: 'Error al agregar los inventarios' });
  }
};

const getInventarioAV = async (req, res) => {
  const { tipo_dif, sector } = req.query;
  console.log('>>> Obteniendo inventarios para el sector:', sector, 'y tipo_dif:', tipo_dif);  try {
    const query = `
      WITH ultima_fecha AS (
        SELECT MAX(d.fecha) AS fecha
        FROM diferencia_inv d
        INNER JOIN usuarios u ON d.usuario = u.id
        WHERE u.sector = $1 AND d.tipo_dif = $2
      )
      SELECT 
        d.fecha, 
        u.sector, 
        d.usuario, 
        d.tipo_dif
      FROM diferencia_inv d
      INNER JOIN usuarios u ON d.usuario = u.id
      WHERE u.sector = $1 
        AND d.tipo_dif = $2 
        AND d.fecha = (SELECT fecha FROM ultima_fecha)
    `;

    const params = [ fecha, sector, tipo_dif ];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron inventarios recientes' });
    }

    console.log('>>> Últimos inventarios encontrados para el sector:', sector, 'y tipo_dif:', tipo_dif, ':', result.rows.length);
    res.status(200).json(result.rows); // Devolver todas las filas relacionadas a la última fecha encontrada
  } catch (error) {
    console.error('Error al obtener los inventarios:', error);
    res.status(500).json({ error: 'Error al obtener los últimos inventarios' });
  }
};

const deleteInventarioAV = async (req, res) => {
  const { fecha, usuario, tipo_dif } = req.params; // Obtener la fecha desde los parámetros
  console.log('>>> Eliminando inventarios con fecha:', fecha, 'usuario:', usuario, 'tipo_dif:', tipo_dif);
  try {
    // Verificar si existen inventarios con la fecha y usuario proporcionados
    const result = await pool.query('SELECT * FROM diferencia_inv WHERE fecha = $1 AND usuario = $2 AND tipo_dif = $3', [fecha, usuario, tipo_dif]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron inventarios con los parámetros proporcionados' });
    }

    // Eliminar todas las filas que coincidan con la fecha y usuario de reposición
    await pool.query('DELETE FROM diferencia_inv WHERE fecha = $1 AND usuario = $2 AND tipo_dif = $3', [fecha, usuario, tipo_dif]);
    res.status(200).json({ message: 'Todos los inventarios con los parámetros proporcionados han sido eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar los inventarios:', error);
    res.status(500).json({ error: 'Error al eliminar los inventarios' });
  }
};



module.exports = {
  addMovimiento,
  getMovimiento,
  deleteMovimiento,
  getMovimientoCercano,
  getUltimosEnvios,
  addInventarioAV,
  getInventarioAV,
  deleteInventarioAV
};