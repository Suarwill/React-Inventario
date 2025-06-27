const pool = require('../db/pool');
const { buscarProducto , eliminarProducto, actualizarConCSV } = require('../services/product.service');

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
  const { cod } = req.params;
  if (!cod) {
    return res.status(400).json({ error: 'Código de producto no proporcionado' });
  }
  try {
    const result = await buscarProducto(cod);
    if (result.length === 0) {
    return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { codigo, descripcion, categoria, estatus } = req.body;
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
  const { cod } = req.params;
  if (!cod) {
    return res.status(400).json({ error: 'Código de producto no proporcionado' });
  }
  try {
    const borrar = await eliminarProducto(cod);
    if (borrar.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
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

  const filePath = req.file.path;
  try {
    const result = await actualizarConCSV(filePath);
    return res.status(200).json(result);
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