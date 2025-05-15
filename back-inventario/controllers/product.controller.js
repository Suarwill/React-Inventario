const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db/pool');

const addProducto = async (req, res) => {
  const { codigo, descripcion, categoria } = req.body;
  try {
    // Aun en desarrollo

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
}

const getProducto = async (req, res) => {
    const { id } = req.query;
    try {
        let result;
        if (id) {
        // Obtener un producto por ID
        result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        } else {
        // Obtener todos los productos
        result = await pool.query('SELECT * FROM productos');
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { codigo, descripcion, categoria } = req.body;
  try {
    // Verificar si el producto existe
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Actualizar el producto
    const updatedResult = await pool.query(
      'UPDATE productos SET codigo = $1, descripcion = $2, categoria = $3 WHERE id = $4 RETURNING *',
      [codigo, descripcion, categoria, id]
    );
    res.status(200).json(updatedResult.rows[0]);
  }
    catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el producto existe
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Eliminar el producto
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

const uploadCsv = async (req, res) => {
  if (!req.file) {
    console.error('No se proporcionó un archivo CSV.');
    return res.status(400).json({ error: 'No se proporcionó un archivo.' });
  }

  const productos = [];
  const filePath = req.file.path;

  try {
    // Leer y procesar el archivo CSV
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        console.log('Fila procesada:', row); // Agrega este log
        const { codigo, descripcion, categoria } = row;
        if (codigo && descripcion && categoria) {
          productos.push([codigo, descripcion, categoria]);
        }
      })
      .on('end', async () => {
        console.log('Total de productos procesados:', productos.length); // Log para verificar el total
        try {
          const query = `
            INSERT INTO productos (codigo, descripcion, categoria)
            VALUES ($1, $2, $3)
            ON CONFLICT (codigo) DO NOTHING
          `;
          for (const producto of productos) {
            await pool.query(query, producto);
          }
          res.status(201).json({ message: 'Productos cargados con éxito.' });
        } catch (error) {
          console.error('Error al insertar productos:', error);
          res.status(500).json({ error: 'Error al cargar los productos.' });
        } finally {
          fs.unlinkSync(filePath); // Eliminar el archivo temporal
        }
      });
  } catch (error) {
    console.error('Error al procesar el archivo CSV:', error);
    res.status(500).json({ error: 'Error al procesar el archivo CSV.' });
  }
};

const editProduct = async (req, res) => {
  const { codigo } = req.params;
  const { categoria } = req.body;

  if (!categoria) {
    return res.status(400).json({ error: 'La nueva categoría es obligatoria.' });
  }

  try {
    const result = await pool.query('SELECT * FROM productos WHERE codigo = $1', [codigo]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const updatedResult = await pool.query(
      'UPDATE productos SET categoria = $1 WHERE codigo = $2 RETURNING *',
      [categoria, codigo]
    );
    res.status(200).json({ message: 'Producto actualizado con éxito.', producto: updatedResult.rows[0] });
  } catch (error) {
    console.error('Error al editar el producto:', error);
    res.status(500).json({ error: 'Error al editar el producto.' });
  }
};

module.exports = {
    addProducto,
    getProducto,
    updateProducto,
    deleteProducto,
    uploadCsv,
    editProduct
}