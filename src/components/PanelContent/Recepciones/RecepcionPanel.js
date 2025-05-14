import React, { useState, useEffect } from 'react';
import { getRecepciones } from './recepcionService';
import './RecepcionPanel.css';

const RecepcionPanel = () => {
  const [recepciones, setRecepciones] = useState([]);

  const handleLoadRecepciones = async () => {
    try {
      console.log('Cargando recepciones...');
      const data = await getRecepciones();
      if (Array.isArray(data) && data.length > 0) {
        // Ordenar por fecha descendente y tomar el más reciente
        const movimientoMasReciente = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        setRecepciones([movimientoMasReciente]);
      } else {
        setRecepciones([]); // No hay recepciones disponibles
      }
    } catch (error) {
      console.error('Error al cargar recepciones:', error);
    }
  };

  useEffect(() => {
    handleLoadRecepciones();
  }, []);

  return (
    <div className="panel-overlay">
      <h2>Recepciones</h2>

      <table className="recepciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Número</th>
            <th>Cantidad</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          {recepciones.length === 0 ? (
            <tr>
              <td colSpan="5">No hay recepciones disponibles</td>
            </tr>
          ) : (
            recepciones.map((recepcion, index) => (
              <tr key={index}>
                <td>{recepcion.fecha}</td>
                <td>{recepcion.nro}</td>
                <td>{recepcion.cant}</td>
                <td>{recepcion.cod}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecepcionPanel;