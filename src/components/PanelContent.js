import React from 'react';

const PanelContent = ({ selected }) => {
  return (
    <div className="panel-content">
      <div className="panel-overlay">
        <h2>{selected}</h2>
        <p>
          Este es el contenido de: <strong>{selected}</strong>
        </p>
      </div>
    </div>
  );
};

export default PanelContent;
