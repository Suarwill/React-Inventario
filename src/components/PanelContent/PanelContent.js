import React from 'react';
import DepositoPanel from './Depositos/DepositoPanel';
import RecepcionPanel from './Recepciones/RecepcionPanel';
import VerificacionPanel from './Recepciones/VerificacionPanel';
import InventariosAV from './Inventarios/inventarioAV';
import InventariosCat from './Inventarios/inventarioCat';
import './PanelContent.css';

const PanelContent = ({ selected }) => {
  //Envios

  //Recepciones
  if (selected === 'Envío desde Matriz')  {return <RecepcionPanel />;}
  if (selected === 'Verificación')        {return <VerificacionPanel />;}

  //Inventarios
  if (selected === 'Diferencia en AV')    {return <InventariosAV />;}
  if (selected === 'Diferencia en Categoría') {return <InventariosCat />;}

  //Depósitos
  if (selected === 'Depósitos')           {return <DepositoPanel />;}

  return (
    <div className="panel-content">
      <h2>{selected}</h2>
      {/* lógica de renderizado */}
    </div>
  );
};

export default PanelContent;
