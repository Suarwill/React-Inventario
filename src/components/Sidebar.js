import React from 'react';

const Sidebar = ({ onSelect }) => {
  const options = [
    'Verificación de EM',
    'Diferencia de Inventario AV',
    'Diferencia de Inventario Categoría',
    'Depósitos'
  ];

  return (
    <div className="sidebar">
      {options.map((opt, idx) => (
        <button key={idx} onClick={() => onSelect(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;