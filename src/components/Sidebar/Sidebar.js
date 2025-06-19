import React, { useState } from 'react';
import './Sidebar.css';

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

  const handleSelect = (option) => {
    onSelect(option);
  };

  return (
    <div className="sidebar">
      <div className="section">
        <button className="main-button-side" onClick={() => toggle('envio')}>
          Envío de Mercadería
        </button>
        {active.envio && (
          <div className="submenu">
            <button className="sub-button-side" onClick={() => handleSelect('Mermas - NC - Eliminados')}>Mermas - NC - Eliminados</button>
            <button className="sub-button-side" onClick={() => handleSelect('Sobrestock')}>Sobrestock</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button-side" onClick={() => toggle('recepcion')}>
          Recepción de Mercadería
        </button>
        {active.recepcion && (
          <div className="submenu">
            <button className="sub-button-side" onClick={() => handleSelect('Envío desde Matriz')}>Envío desde Matriz</button>
            <button className="sub-button-side" onClick={() => handleSelect('Verificación')}>Verificación</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button-side" onClick={() => toggle('inventario')}>
          Inventarios
        </button>
        {active.inventario && (
          <div className="submenu">
            <button className="sub-button-side" onClick={() => handleSelect('Diferencia en AV')}>Diferencia en AV</button>
            <button className="sub-button-side" onClick={() => handleSelect('Diferencia en Categoría')}>Diferencia en Categoría</button>
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