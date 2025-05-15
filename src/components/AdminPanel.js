import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState('');
  const [zona, setZona] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [deleteUser, setDeleteUser] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newZona, setNewZona] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [modal, setModal] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const promptShownRef = useRef(false);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (!promptShownRef.current) {
      const secretKey = window.prompt('Ingrese la clave para acceder al panel de administración:');
      if (secretKey === 'ingresar') {
        setIsAuthorized(true);
      } else {
        alert('Clave incorrecta. Redirigiendo al dashboard.');
        navigate('/dashboard');
      }
      promptShownRef.current = true;
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !sector.trim() || !zona.trim()) {
      return showMessage('Por favor, complete todos los campos.', 'error');
    }

    try {
      const res = await axiosInstance.post('/api/user/register', { username, password, sector, zona });
      showMessage(res.data.message || 'Usuario registrado con éxito.');
      setUsername('');
      setPassword('');
      setSector('');
      setZona('');
      setModal(null); // Cierra el modal
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al registrar el usuario.', 'error');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.get('/api/user/search', { params: { username: searchQuery } });
      setSearchResults(res.data);
      showMessage('');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al buscar usuario.', 'error');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.delete(`/api/user/${deleteUser}`);
      showMessage(res.data.message);
      setDeleteUser('');
      setModal(null); // Cierra el modal
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al eliminar usuario.', 'error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
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
      setEditUsername('');
      setNewUsername('');
      setNewPassword('');
      setNewSector('');
      setNewZona('');
      setModal(null); // Cierra el modal
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al editar usuario.', 'error');
    }
  };

  const handleUploadCsv = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      return showMessage('Por favor, seleccione un archivo CSV.', 'error');
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await axiosInstance.post('/api/product/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showMessage(res.data.message || 'Productos cargados con éxito.');
      setCsvFile(null);
      setModal(null); // Cierra el modal
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al cargar el archivo CSV.', 'error');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!codigo.trim() || !nuevaCategoria.trim()) {
      return showMessage('Por favor, complete todos los campos.', 'error');
    }

    try {
      const res = await axiosInstance.put(`/api/product/edit/${codigo}`, { categoria: nuevaCategoria });
      showMessage(res.data.message || 'Producto actualizado con éxito.');
      setCodigo('');
      setNuevaCategoria('');
      setModal(null); // Cierra el modal
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al editar el producto.', 'error');
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="admin-panel">
      <h2>Panel de {usuario}</h2>

      <div className="grid-container">
        <button onClick={() => setModal('register')}>Agregar Usuario</button>
        <button onClick={() => setModal('edit')}>Editar Usuario</button>
        <button onClick={() => setModal('search')}>Buscar Usuario</button>
        <button onClick={() => setModal('delete')}>Eliminar Usuario</button>
        <button onClick={() => setModal('uploadCsv')}>Agregar Productos (CSV)</button>
        <button onClick={() => setModal('editProduct')}>Editar Producto</button>
      </div>

      {/* Modal para Agregar Usuario */}
      {modal === 'register' && (
        <div className="modal">
          <h3>Agregar Usuario</h3>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            />
            <button type="submit">Crear</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
        </div>
      )}

      {/* Modal para Editar Usuario */}
      {modal === 'edit' && (
        <div className="modal">
          <h3>Editar Usuario</h3>
          <form onSubmit={handleEdit}>
            <input
              type="text"
              placeholder="Usuario actual"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nuevo usuario (opcional)"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nuevo sector (opcional)"
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nueva zona (opcional)"
              value={newZona}
              onChange={(e) => setNewZona(e.target.value)}
            />
            <button type="submit">Editar</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
        </div>
      )}

      {/* Modal para Buscar Usuario */}
      {modal === 'search' && (
        <div className="modal">
          <h3>Buscar Usuario</h3>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button type="submit">Buscar</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal para Eliminar Usuario */}
      {modal === 'delete' && (
        <div className="modal">
          <h3>Eliminar Usuario</h3>
          <form onSubmit={handleDelete}>
            <input
              type="text"
              placeholder="Usuario a eliminar"
              value={deleteUser}
              onChange={(e) => setDeleteUser(e.target.value)}
              required
            />
            <button type="submit">Eliminar</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
        </div>
      )}

      {/* Modal para cargar productos desde un archivo CSV */}
      {modal === 'uploadCsv' && (
        <div className="modal">
          <h3>Cargar Productos (CSV)</h3>
          <form onSubmit={handleUploadCsv}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              required
            />
            <button type="submit">Cargar</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
        </div>
      )}

      {/* Modal para editar un producto */}
      {modal === 'editProduct' && (
        <div className="modal">
          <h3>Editar Producto</h3>
          <form onSubmit={handleEditProduct}>
            <input
              type="text"
              placeholder="Código del producto"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              required
            />
            <button type="submit">Actualizar</button>
            <button type="button" onClick={() => setModal(null)}>Cerrar</button>
          </form>
        </div>
      )}

      {/* Mensajes */}
      {message && (
        <p className={`admin-message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminPanel;