import axiosInstance from '../../axiosConfig';
const API_URL = '/api/movimiento';

export const getRecepciones = async () => {
  try {
    const sector = localStorage.getItem('sector'); // Obtener el sector del localStorage
    console.log('Sector desde localStorage:', sector);
    if (!sector) {
      throw new Error('Sector no encontrado en localStorage');
    }

    const response = await axiosInstance.get(`${API_URL}/closest`, {
      params: { destino: sector },
    });

    return response.data;
  } catch (error) {
    console.error('Error al cargar recepciones:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al cargar recepciones';
  }
};