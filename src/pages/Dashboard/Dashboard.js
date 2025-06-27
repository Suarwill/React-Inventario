import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import PanelContent from '../../components/PanelContent/PanelContent';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Verificación de EM');
  const [envioData, setEnvioData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username') || 'Usuario';
    if (username === 'admin') {
      navigate('/admin'); // Redirige al panel de administración si el usuario es admin
    }
  }, [navigate]);

  const sector = localStorage.getItem('sector') || 'Sector';


  return (
    <div className="dashboard-wrapper">
      <Navbar sector={sector} />
      <div className="dashboard-container">
        <Sidebar onSelect={setSelectedOption} />
        <PanelContent
          selected={selectedOption}
          envioData={envioData}
          setEnvioData={setEnvioData}
        />
      </div>
    </div>
  );
};

export default Dashboard;