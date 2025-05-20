import React from 'react';
import './PanelContent.css';
import DepositoPanel from './Depositos/DepositoPanel';
import RecepcionPanel from './Recepciones/RecepcionPanel';
import VerificacionPanel from './Recepciones/VerificacionPanel';

const PanelContent = ({ selected }) => {
  if (selected === 'Depósitos') {
    return <DepositoPanel />;
  }

  if (selected === 'Envío desde Matriz') {
    return <RecepcionPanel />;
  }

  if (selected === 'Verificación') {
    return <VerificacionPanel />;
  }

  return (
    <div className="panel-content">
      <h2>{selected}</h2>
      {/* lógica de renderizado */}
    </div>
  );
};

export default PanelContent;
