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

module.exports = {
    addProducto,
    getProducto,
    updateProducto,
    deleteProducto
}