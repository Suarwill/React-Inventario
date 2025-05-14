import axiosInstance from '../../axiosConfig';
const API_URL = '/api/envios';

export const getEnvios = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/search`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar envíos:', error);
    throw error.response?.data?.error || 'Error al cargar envíos';
  }
};

export const addEnvio = async (nuevoEnvio) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/add`, nuevoEnvio);
    return response.data;
  } catch (error) {
    console.error('Error al agregar envío:', error);
    throw error.response?.data?.error || 'Error al agregar envío';
  }
};

export const deleteEnvio = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar envío:', error);
    throw error.response?.data?.error || 'Error al eliminar envío';
  }
};