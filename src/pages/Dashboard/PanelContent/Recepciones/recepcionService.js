import axiosInstance from '../../../../components/axiosConfig';
const API_URL = '/api/movimiento';

export const getRecepciones = async () => {
  try {
    const sector = localStorage.getItem('sector'); // Obtener el sector del localStorage
    if (!sector) {
      throw new Error('Sector no encontrado en localStorage');
    }

    const response = await axiosInstance.get(`${API_URL}/closest`, {
      params: { destino: sector },
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
    console.error('Error al cargar recepciones:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al cargar recepciones';
  }
};