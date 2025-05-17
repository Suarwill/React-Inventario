import axios from 'axios';

/**
 * Obtiene los últimos envíos hacia el sector especificado.
 * @param {string} destino - El sector de destino.
 * @returns {Promise} - Promesa que resuelve con los datos de los envíos.
 */
export const fetchUltimosEnvios = async (destino) => {
  try {
    const response = await axios.get('/api/movimientos/last', {
      params: { destino },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los últimos envíos:', error);
    throw new Error('Error al obtener los últimos envíos.');
  }
};

/**
 * Obtiene la lista de productos.
 * @returns {Promise} - Promesa que resuelve con los datos de los productos.
 */
export const fetchProductos = async () => {
  try {
    const response = await axios.get('/api/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw new Error('Error al obtener los productos.');
  }
};

/**
 * Envía un conteo al backend.
 * @param {Object} conteo - Datos del conteo.
 * @returns {Promise} - Promesa que resuelve cuando el conteo se envía correctamente.
 */
export const enviarConteo = async (conteo) => {
  try {
    await axios.post('/api/conteo/add', conteo);
  } catch (error) {
    console.error('Error al enviar el conteo:', error);
    throw new Error('Error al enviar el conteo.');
  }
};