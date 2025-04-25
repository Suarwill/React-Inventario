import React from 'react';
import './Navbar.css';

const Navbar = () => {
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/'; // Redirige al login
  };

  return (
    <nav className="navbar">
      <h1>Panel de {username}</h1>
      <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
    </nav>
  );
};

export default Navbar;