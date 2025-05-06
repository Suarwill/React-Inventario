import React, { useState } from 'react';

const Sidebar = ({ onSelect }) => {
  const [showInventarioSubmenu, setShowInventarioSubmenu] = useState(false);

  return (
    <div className="sidebar">
      <button onClick={() => onSelect('Verificación de EM')}>
        Verificación de EM
      </button>

      <button onClick={() => setShowInventarioSubmenu(!showInventarioSubmenu)}>
        Inventarios
      </button>

      {showInventarioSubmenu && (
        <div className="submenu">
          <button onClick={() => onSelect('Diferencia de Inventario AV')}>
            Diferencias de AV
          </button>
          <button onClick={() => onSelect('Diferencia de Inventario Categoría')}>
            Diferencias de Categoría
          </button>
        </div>
      )}

      <button onClick={() => onSelect('Depósitos')}>
        Depósitos
      </button>
    </div>
  );
};

export default Sidebar;
