import React, { useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!username.trim() || !password.trim()) {
      setMessage('Por favor, ingrese usuario y contraseña.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('/user/register', { username, password });

      setMessage(response.data.message || 'Usuario registrado con éxito.');
      setMessageType('success');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(error.response?.data?.error || 'Error al registrar el usuario. Intente de nuevo.');
      setMessageType('error');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]); // Clear previous results

    if (!searchQuery.trim()) {
      setMessage('Por favor, ingrese un nombre de usuario para buscar.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.get('/user/search', { params: { username: searchQuery } });
      setSearchResults(response.data);
      setMessage('');
      setMessageType('');
    } catch (error) {
      console.error("Error searching for user:", error);
      setMessage(error.response?.data?.error || 'Error al buscar el usuario. Intente de nuevo.');
      setMessageType('error');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Administrar Usuarios</h2>

      <form onSubmit={handleRegister} className="admin-form">
        <h3>Agregar Nuevo Usuario</h3>
        <div className="form-group">
          <label htmlFor="new-username">Usuario:</label>
          <input
            id="new-username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">Contraseña:</label>
          <input
            id="new-password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-button">Agregar Usuario</button>
        {message && (
          <p className={`admin-message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
            {message}
          </p>
        )}
      </form>

      <form onSubmit={handleSearch} className="search-form">
        <h3>Buscar Usuario</h3>
        <div className="form-group">
          <label htmlFor="search-username">Usuario a buscar:</label>
          <input
            id="search-username"
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-button">Buscar</button>
        {message && (
          <p className={`admin-message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
            {message}
          </p>
        )}
      </form>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Resultados de la búsqueda:</h3>
          <ul>
            {searchResults.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
