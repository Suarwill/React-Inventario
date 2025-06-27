import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login'; // Ruta permanece igual
import Dashboard from './pages/Dashboard/Dashboard'; // Actualización de la ruta
import AdminPanel from './pages/AdminPanel/AdminPanel'; // Actualización de la ruta
import Zonal from './pages/Zonal/zonal'; // Actualización de la ruta


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/zonal" element={<Zonal />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;