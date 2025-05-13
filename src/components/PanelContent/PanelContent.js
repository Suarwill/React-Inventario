import React from 'react';
import './PanelContent.css';
import DepositoPanel from './Depositos/DepositoPanel';

const PanelContent = ({ selected }) => {
  if (selected === 'Depósitos') {
    return <DepositoPanel />;
  }

  return (
    <div className="panel-content">
      <h2>{selected}</h2>
      {/* lógica de renderizado */}
    </div>
  );
};

export default PanelContent;