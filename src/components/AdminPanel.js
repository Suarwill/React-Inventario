import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import './AdminPanel.css';

const AdminPanel = () => {
  const usuario = localStorage.getItem('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [deleteUser, setDeleteUser] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return showMessage('Por favor, ingrese usuario y contraseña.', 'error');
    }

    try {
      const res = await axiosInstance.post('/user/register', { username, password });
      showMessage(res.data.message || 'Usuario registrado con éxito.');
      setUsername('');
      setPassword('');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al registrar el usuario.', 'error');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.get('/user/search', { params: { username: searchQuery } });
      setSearchResults(res.data);
      showMessage('');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al buscar usuario.', 'error');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.delete(`/user/${deleteUser}`);
      showMessage(res.data.message);
      setDeleteUser('');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al eliminar usuario.', 'error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editUsername.trim() || (!newUsername.trim() && !newPassword.trim())) {
      return showMessage('Ingrese un usuario actual y al menos un dato nuevo.', 'error');
    }

    try {
      const res = await axiosInstance.put(`/user/${editUsername}`, {
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });
      showMessage(res.data.message);
      setEditUsername('');
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error al editar usuario.', 'error');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel de {usuario}</h2>

      <div className="grid-container">
        {/* Crear Usuario */}
        <div className="admin-box">
          <h3>Crear Usuario</h3>
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
            <button type="submit">Crear</button>
          </form>
        </div>

        {/* Buscar Usuario */}
        <div className="admin-box">
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
          </form>
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Eliminar Usuario */}
        <div className="admin-box">
          <h3>Eliminar Usuario</h3>
          <form onSubmit={handleDelete}>
            <input
              type="text"
              placeholder="Usuario a eliminar"
              value={deleteUser}
              onChange={(e) => setDeleteUser(e.target.value)}
              required
            />
            <button type="submit" className="delete-button">Eliminar</button>
          </form>
        </div>

        {/* Editar Usuario */}
        <div className="admin-box">
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
            <button type="submit" className="edit-button">Editar</button>
          </form>
        </div>
      </div>

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