import React, { useState } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // We'll create this CSS file next

const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(''); // Clear previous messages
    setMessageType('');

    if (!username.trim() || !password.trim()) {
      setMessage('Por favor, ingrese usuario y contraseña.');
      setMessageType('error');
      return;
    }

    try {
      // Assuming your backend runs on localhost:3000 and the frontend proxy handles '/user/register'
      // If not, you might need the full URL: 'http://localhost:3000/user/register'
      // Or configure axios defaults or a proxy in package.json
      const response = await axios.post('/user/register', { username, password });

      setMessage(response.data.message || 'Usuario registrado con éxito.');
      setMessageType('success');
      setUsername(''); // Clear fields on success
      setPassword('');
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(error.response?.data?.error || 'Error al registrar el usuario. Intente de nuevo.');
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
      {/* Add sections for searching or deleting users later if needed */}
    </div>
  );
};

export default AdminPanel;
