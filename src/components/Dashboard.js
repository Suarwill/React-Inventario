import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import PanelContent from './PanelContent/PanelContent';
import Navbar from './Navbar/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Verificación de EM');
  const [envioData, setEnvioData] = useState(null);

  const username = localStorage.getItem('username') || 'Usuario';

  return (
    <div className="dashboard-wrapper">
      <Navbar username={username} />
      <div className="dashboard-container">
        <Sidebar onSelect={setSelectedOption} />
        <PanelContent selected={selectedOption}
          envioData={envioData}
          setEnvioData={setEnvioData}
        />
      </div>
    </div>
  );
};

export default Dashboard;