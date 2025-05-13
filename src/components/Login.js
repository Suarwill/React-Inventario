import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig'; // Importa el axios configurado
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setMensaje('Ingrese usuario y contraseña');
      return;
    }

    try {
      const response = await axiosInstance.post('/user/login', { username, password });

      // Si todo OK, guardamos el usuario y el token en el localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('id', response.data.user.id); // Guardando el usuario aquí
      localStorage.setItem('token', response.data.token); // Guardando el token aquí

      setMensaje('Login exitoso');
      navigate('/dashboard');
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>Enterprise</h1>
        </div>
        <div className="login-right">
          <h2>Ingresar a su Panel</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Entrar</button>
          {mensaje && <p className="login-message">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
