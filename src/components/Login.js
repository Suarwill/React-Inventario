import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí podrías validar con backend o simplemente hacer una validación mock
    if (username.trim() && password.trim()) {
      localStorage.setItem('username', username);
      navigate('/dashboard'); // redirige al dashboard
    } else {
      alert('Ingrese usuario y contraseña');
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
            type="email"
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
        </div>
      </div>
    </div>
  );
};

export default Login;
