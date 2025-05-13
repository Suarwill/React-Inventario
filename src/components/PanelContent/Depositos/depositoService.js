const API_URL = 'http://localhost:3000/deposito';

export const getDepositos = async () => {
  try {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('username');
    const userId = localStorage.getItem('id');

    if (!usuario) {
      throw new Error('Usuario no encontrado en localStorage');
    }

    const response = await fetch(`${API_URL}/search?id=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al cargar depósitos');
    return await response.json();
  } catch (error) {
    console.error('Error al cargar depósitos:', error);
    throw error;
  }
};


export const addDeposito = async (nuevoDeposito) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
      body: JSON.stringify(nuevoDeposito),
    });
    if (!response.ok) throw new Error('Error al agregar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al agregar depósito:', error);
    throw error;
  }
};

export const updateDeposito = async (id, depositoEditado) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
      body: JSON.stringify(depositoEditado),
    });
    if (!response.ok) throw new Error('Error al editar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al editar depósito:', error);
    throw error;
  }
};

export const deleteDeposito = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
    });
    if (!response.ok) throw new Error('Error al eliminar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar depósito:', error);
    throw error;
  }
};