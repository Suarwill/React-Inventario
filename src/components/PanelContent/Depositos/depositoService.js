import axiosInstance from '../../axiosConfig';
const API_URL = '/api/deposito';

export const getDepositos = async () => {
  try {
    const userId = localStorage.getItem('id');

    if (!userId) {
      throw new Error('Usuario no encontrado en localStorage');
    }

    const response = await axiosInstance.get(`${API_URL}/search`, {
      params: { id: userId },
    });

    // Formatear los datos antes de retornarlos
    const formattedData = response.data.map((deposito) => ({
      ...deposito,
      fecha: new Date(deposito.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      monto: `$${deposito.monto}`,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error al cargar depósitos:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al cargar depósitos';
  }
};

export const addDeposito = async (nuevoDeposito) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/add`, nuevoDeposito);

    return response.data;
  } catch (error) {
    console.error('Error al agregar depósito:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al agregar depósito';
  }
};

export const updateDeposito = async (id, depositoEditado) => {
  try {
    const userId = localStorage.getItem('id'); // Obtén el usuarioId de localStorage
    const depositoConUsuario = { ...depositoEditado, usuarioId: userId }; // Agrega usuarioId al cuerpo

    const response = await axiosInstance.put(`${API_URL}/${id}`, depositoConUsuario);

    return response.data;
  } catch (error) {
    console.error('Error al editar depósito:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al editar depósito';
  }
};

export const deleteDeposito = async (id) => {
  try {
    const userId = localStorage.getItem('id'); // Obtén el usuarioId de localStorage

    const response = await axiosInstance.delete(`${API_URL}/${id}`, {
      data: { usuarioId: userId }, // Envía usuarioId en el cuerpo
    });

    return response.data;
  } catch (error) {
    console.error('Error al eliminar depósito:', error.response?.data || error);
    throw error.response?.data?.error || 'Error al eliminar depósito';
  }
};