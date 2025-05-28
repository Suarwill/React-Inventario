import axiosInstance from '../../axiosConfig';
const API_URL = '/api/movimiento';

export const fetchUltimosEnvios = async () => {
  try {
    const sector = localStorage.getItem('sector');
    if (!sector) {
      throw new Error('Sector no definido en localStorage.');
    }

    const response = await axiosInstance.get(`${API_URL}/last`, {
      params: { destino: sector },
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener los últimos envíos:', error);
    throw new Error('Error al obtener los últimos envíos.');
  }
};

/**
 * Envía un array de conteos al backend.
 * @param {Array} conteos - Array de objetos con los datos del conteo.
 * @returns {Promise} - Promesa que resuelve cuando los conteos se envían correctamente.
 */
export const enviarConteo = async (conteos) => {
  try {
    if (!Array.isArray(conteos) || conteos.length === 0) {
      throw new Error('El parámetro debe ser un array de conteos.');
    }

    // Validar que cada objeto en el array tenga los campos requeridos
    conteos.forEach((conteo) => {
      console.log('Validando conteo:', conteo); // Depuración
      if (!conteo.tipo || !conteo.cant || !conteo.cod || !conteo.nro_envio || !conteo.usuario) {
        throw new Error('Datos de conteo incompletos.');
      }
    });

    // Enviar el array completo al backend
    await axiosInstance.post('/api/conteo/add', conteos);
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
 * Obtiene las verificaciones desde el backend para múltiples números de envío.
 * @param {Array<string>} numerosEnvio - Array de números de envío para filtrar las verificaciones.
 * @returns {Promise<Array>} - Promesa que resuelve con las verificaciones consolidadas.
 */
export const obtenerVerificaciones = async (numerosEnvio) => {
  try {
    if (!Array.isArray(numerosEnvio) || numerosEnvio.length === 0) {
      throw new Error('Se requiere un array de números de envío.');
    }

    // Realizar solicitudes para cada número de envío
    const verificacionesPromises = numerosEnvio.map((nroEnvio) =>
      axiosInstance.get(`/api/conteo/search`, { params: { nro_envio: nroEnvio } })
    );

    // Esperar todas las solicitudes y consolidar los resultados
    const verificacionesData = await Promise.all(verificacionesPromises);
    return verificacionesData.flatMap(response => response.data);
  } catch (error) {
    console.error('Error al obtener las verificaciones:', error);
    throw new Error('Error al obtener las verificaciones.');
  }
};