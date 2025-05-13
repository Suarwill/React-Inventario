const API_URL = 'http://localhost:3000/deposito';

export const fetchDepositos = async () => {
  try {
    const response = await fetch(`${API_URL}/search`);
    if (!response.ok) throw new Error('Error al cargar depósitos');
    return await response.json();
  } catch (error) {
    console.error('Error al cargar depósitos:', error);
    throw error;
  }
};

export const addDeposito = async (nuevoDeposito) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoDeposito),
    });
    if (!response.ok) throw new Error('Error al agregar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al agregar depósito:', error);
    throw error;
  }
};

export const editDeposito = async (id, depositoEditado) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar depósito');
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar depósito:', error);
    throw error;
  }
};