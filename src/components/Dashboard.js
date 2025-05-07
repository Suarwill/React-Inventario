import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PanelContent from './PanelContent';
import Navbar from './Navbar';
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