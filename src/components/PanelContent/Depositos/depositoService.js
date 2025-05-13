const API_URL = 'http://localhost:3000/deposito';

export const getDepositos = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if (!userId) {
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
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id'); // Obtén el usuarioId de localStorage

    const depositoConUsuario = { ...nuevoDeposito, usuarioId: userId }; // Agrega usuarioId al cuerpo

    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(depositoConUsuario),
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
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id'); // Obtén el usuarioId de localStorage

    const depositoConUsuario = { ...depositoEditado, usuarioId: userId }; // Agrega usuarioId al cuerpo

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(depositoConUsuario),
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
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id'); // Obtén el usuarioId de localStorage

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ usuarioId: userId }), // Envía usuarioId en el cuerpo
    });

    if (!response.ok) throw new Error('Error al eliminar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar depósito:', error);
    throw error;
  }
};