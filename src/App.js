import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login'; // Actualización de la ruta
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Zonal from './components/Zonal/zonal';


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