import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../components/axiosConfig';
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
      const response = await axiosInstance.post('/api/user/login', { username, password });

      localStorage.setItem('username', username);
      localStorage.setItem('id', response.data.user.id);
      localStorage.setItem('sector', response.data.user.sector);
      localStorage.setItem('zona', response.data.user.zona);
      localStorage.setItem('token', response.data.token);

      setMensaje('Login exitoso');
      console.log(response.data.user.sector);
      
      switch (response.data.user.sector) {
        case 'ADMINISTRACION':
          navigate('/admin');
          break;
          
        case 'ZONAL Z0':
        case 'ZONAL ZII':
        case 'ZONAL ZIV':
        case 'ZONAL ZV':
        case 'ZONAL ZS1':
        case 'ZONAL ZS2':
        case 'ZONAL ZVIII':
        case 'ZONAL ZX':
          navigate('/zonal');
          break;
          
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error.response?.data || error);
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
