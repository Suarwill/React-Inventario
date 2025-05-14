import React from 'react';
import './PanelContent.css';
import DepositoPanel from './Depositos/DepositoPanel';
import RecepcionPanel from './Recepciones/RecepcionPanel'; // <- Asegúrate que la ruta es correcta

const PanelContent = ({ selected }) => {
  if (selected === 'Depósitos') {
    return <DepositoPanel />;
  }

  if (selected === 'Envío desde Matriz') {
    return <RecepcionPanel />;
  }

  return (
    <div className="panel-content">
      <h2>{selected}</h2>
      {/* lógica de renderizado */}
    </div>
  );
};

export default PanelContent;
