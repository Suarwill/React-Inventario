import axios from 'axios';

/**
 * Obtiene los últimos envíos hacia el sector especificado.
 * @returns {Promise} - Promesa que resuelve con los datos de los envíos.
 */
export const fetchUltimosEnvios = async () => {
  try {
    const destino = localStorage.getItem('sector');
    if (!destino) {
      throw new Error('Sector no definido en localStorage.');
    }

    const response = await axios.get('/api/movimientos/last', {
      params: { destino },
    });
    const data = response.data;
    const formattedData = (Array.isArray(data) ? data : [data]).map((item) => ({
      ...item,
      fecha: new Date(item.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }));
    return formattedData;
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
    if (!conteo || !conteo.tipo || !conteo.cant || !conteo.cod || !conteo.nro_envio) {
      throw new Error('Datos de conteo incompletos.');
    }

    await axios.post('/api/conteo/add', conteo);
  } catch (error) {
    console.error('Error al enviar el conteo:', error);
    throw new Error('Error al enviar el conteo.');
  }
};

/**
 * Agrupa envíos por número y suma las cantidades.
 * @param {Array} data - Datos de los envíos.
 * @returns {Array} - Datos agrupados por número de envío.
 */
export const agruparEnviosPorNumero = (data) => {
  const grouped = data.reduce((acc, item) => {
    const { nro, fecha, cant } = item;
    if (!acc[nro]) {
      acc[nro] = { nro, fecha, cantidadEnviada: 0 };
    }
    acc[nro].cantidadEnviada += cant;
    return acc;
  }, {});
  return Object.values(grouped);
};

/**
 * Calcula la cantidad verificada para un número de envío.
 * @param {Array} conteo - Datos del conteo.
 * @param {number} nro - Número de envío.
 * @returns {number} - Cantidad verificada.
 */
export const calcularCantidadVerificada = (conteo, nro) => {
  return conteo
    .filter((item) => item.nro_envio === nro)
    .reduce((sum, item) => sum + item.cant, 0);
};

/**
 * Calcula la diferencia entre la cantidad enviada y la cantidad verificada.
 * @param {number} cantidadEnviada - Cantidad enviada.
 * @param {number} cantidadVerificada - Cantidad verificada.
 * @returns {number} - Diferencia.
 */
export const calcularDiferencia = (cantidadEnviada, cantidadVerificada) => {
  return cantidadVerificada - cantidadEnviada;
};