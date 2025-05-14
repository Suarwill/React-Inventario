import React, { useState } from 'react';
import './Sidebar.css';
import axios from 'axios';

const Sidebar = ({ onSelect }) => {
  const [active, setActive] = useState({
    envio: false,
    recepcion: false,
    inventario: false
  });

  const toggle = (section) => {
    setActive((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSelect = async (option) => {
    if (option === 'Envío desde Matriz') {
      const sector = localStorage.getItem('sector'); // Obtener el sector del localStorage
      try {
        const response = await axios.get('/movimiento/closest', {
          params: { destino: sector },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const movimiento = response.data;
        console.log('Movimiento más cercano:', movimiento);
        // Aquí puedes pasar los datos al panel de contenido
        onSelect(option, movimiento);
      } catch (error) {
        console.error('Error al cargar el movimiento más cercano:', error);
      }
    } else {
      onSelect(option);
    }
  };

  return (
    <div className="sidebar">
      <div className="section">
        <button className="main-button-side" onClick={() => toggle('envio')}>
          Envío de Mercadería
        </button>
        {active.envio && (
          <div className="submenu">
            <button className="sub-button" onClick={() => handleSelect('Mermas - NC - Eliminados')}>Mermas - NC - Eliminados</button>
            <button className="sub-button" onClick={() => handleSelect('Sobrestock')}>Sobrestock</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button-side" onClick={() => toggle('recepcion')}>
          Recepción de Mercadería
        </button>
        {active.recepcion && (
          <div className="submenu">
            <button className="sub-button" onClick={() => handleSelect('Envío desde Matriz')}>Envío desde Matriz</button>
            <button className="sub-button" onClick={() => handleSelect('Verificación')}>Verificación</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button-side" onClick={() => toggle('inventario')}>
          Inventarios
        </button>
        {active.inventario && (
          <div className="submenu">
            <button className="sub-button" onClick={() => handleSelect('Diferencia en AV')}>Diferencia en AV</button>
            <button className="sub-button" onClick={() => handleSelect('Diferencia en Categoría')}>Diferencia en Categoría</button>
          </div>
        )}
      </div>

      <button className="main-button-side" onClick={() => handleSelect('Depósitos')}>
        Depósitos
      </button>
    </div>
  );
};

export default Sidebar;