import axiosInstance from "../../../components/axiosConfig";

export const handleRegister = async (data, showMessage, setModal) => {
  const { username, password, sector, zona } = data;
  if (!username.trim() || !password.trim() || !sector.trim() || !zona.trim()) {
    return showMessage('Por favor, complete todos los campos.', 'error');
  }

  try {
    const res = await axiosInstance.post('/api/user/register', { username, password, sector, zona });
    showMessage(res.data.message || 'Usuario registrado con éxito.');
    setModal(null);
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al registrar el usuario.', 'error');
  }
};

export const handleSearch = async (query, setSearchResults, showMessage) => {
  try {
    const res = await axiosInstance.get('/api/user/search', { params: { username: query } });
    setSearchResults(res.data);
    showMessage('');
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al buscar usuario.', 'error');
  }
};

export const handleDelete = async (username, showMessage, setModal) => {
  try {
    const res = await axiosInstance.delete(`/api/user/${username}`);
    showMessage(res.data.message);
    setModal(null);
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al eliminar usuario.', 'error');
  }
};

export const handleEdit = async (data, showMessage, setModal) => {
  const { editUsername, newUsername, newPassword, newSector, newZona } = data;
  if (!editUsername.trim() || (!newUsername.trim() && !newPassword.trim() && !newSector.trim() && !newZona.trim())) {
    return showMessage('Ingrese un usuario actual y al menos un dato nuevo.', 'error');
  }

  try {
    const res = await axiosInstance.put(`/api/user/${editUsername}`, {
      newUsername: newUsername.trim() || undefined,
      newPassword: newPassword.trim() || undefined,
      newSector: newSector.trim() || undefined,
      newZona: newZona.trim() || undefined,
    });
    showMessage(res.data.message);
    setModal(null);
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al editar usuario.', 'error');
  }
};

export const handleEditProduct = async (codigo, nuevaCategoria, showMessage, setModal) => {
  if (!codigo.trim() || !nuevaCategoria.trim()) {
    return showMessage('Por favor, complete todos los campos.', 'error');
  }

  try {
    const res = await axiosInstance.put(`/api/product/edit/${codigo}`, { categoria: nuevaCategoria });
    showMessage(res.data.message || 'Producto actualizado con éxito.');
    setModal(null);
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al editar el producto.', 'error');
  }
};