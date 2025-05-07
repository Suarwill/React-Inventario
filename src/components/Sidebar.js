import React, { useState } from 'react';

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

  return (
    <div className="sidebar">
      <div className="section">
        <button className="main-button" onClick={() => toggle('envio')}>
          Envío de Mercadería
        </button>
        {active.envio && (
          <div className="submenu">
            <button className="sub-button" onClick={() => onSelect('Mermas - NC - Eliminados')}>Mermas - NC - Eliminados</button>
            <button className="sub-button" onClick={() => onSelect('Sobrestock')}>Sobrestock</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button" onClick={() => toggle('recepcion')}>
          Recepción de Mercadería
        </button>
        {active.recepcion && (
          <div className="submenu">
            <button className="sub-button" onClick={() => onSelect('Envío desde Matriz')}>Envío desde Matriz</button>
            <button className="sub-button" onClick={() => onSelect('Verificación')}>Verificación</button>
          </div>
        )}
      </div>

      <div className="section">
        <button className="main-button" onClick={() => toggle('inventario')}>
          Inventarios
        </button>
        {active.inventario && (
          <div className="submenu">
            <button className="sub-button" onClick={() => onSelect('Diferencia en AV')}>Diferencia en AV</button>
            <button className="sub-button" onClick={() => onSelect('Diferencia en Categoría')}>Diferencia en Categoría</button>
          </div>
        )}
      </div>

      <button className="main-button" onClick={() => onSelect('Depósitos')}>
        Depósitos
      </button>
    </div>
  );
};

export default Sidebar;