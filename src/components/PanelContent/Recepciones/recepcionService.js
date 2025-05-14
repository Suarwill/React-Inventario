import axiosInstance from '../../axiosConfig';
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

    return response.data;
  } catch (error) {
    console.error('Error al cargar recepciones:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al cargar recepciones';
  }
};

export const addRecepcion = async (nuevaRecepcion) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/add`, nuevaRecepcion);
    return response.data;
  } catch (error) {
    console.error('Error al agregar recepción:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al agregar recepción';
  }
};

export const deleteRecepcion = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar recepción:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al eliminar recepción';
  }
};