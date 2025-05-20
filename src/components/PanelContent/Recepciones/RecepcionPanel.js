import React, { useState, useEffect } from 'react';
import { getRecepciones } from './recepcionService';
import './RecepcionPanel.css';

const RecepcionPanel = () => {
  const [recepciones, setRecepciones] = useState([]);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);

  const handleLoadRecepciones = async () => {
    try {
      console.log('Cargando recepciones...');
      const data = await getRecepciones();
      if (Array.isArray(data) && data.length > 0) {
        // Ordenar por fecha descendente y tomar el más reciente
        const movimientoMasReciente = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        setUltimoEnvio(movimientoMasReciente); // Guardar el último envío
        setRecepciones(data); // Cargar todas las filas
      } else {
        setUltimoEnvio(null); // No hay último envío
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
          {/* Fila superior con la fecha y número del último envío */}
          {ultimoEnvio && (
            <tr>
              <th colSpan="3">Último Envío</th>
            </tr>
          )}
          {ultimoEnvio && (
            <tr>
              <td colSpan="1">Fecha: {ultimoEnvio.fecha}</td>
              <td colSpan="2">Número: {ultimoEnvio.nro}</td>
            </tr>
          )}
          {/* Cabeceras para las filas de recepciones */}
          <tr>
            <th>Cantidad</th>
            <th>Código</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {recepciones.length === 0 ? (
            <tr>
              <td colSpan="3">No hay recepciones disponibles</td>
            </tr>
          ) : (
            recepciones.map((recepcion, index) => (
              <tr key={index}>
                <td>{recepcion.cant}</td>
                <td>{recepcion.cod}</td>
                <td>{recepcion.descripcion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecepcionPanel;