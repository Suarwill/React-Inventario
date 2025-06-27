import React, { useState, useEffect } from 'react';
import { getRecepciones } from './recepcionService';
import './RecepcionPanel.css';

const RecepcionPanel = () => {
  const [recepcionesCercanas, setRecepcionesCercanas] = useState([]);

  const handleLoadRecepciones = async () => {
    try {
      console.log('Cargando recepciones...');
      const data = await getRecepciones();
      if (Array.isArray(data) && data.length > 0) {
        // Encontrar la fecha más cercana a la fecha actual
        const fechaActual = new Date();
        const recepcionMasCercana = data.reduce((masCercana, recepcion) => {
          const fechaRecepcion = new Date(recepcion.fecha);
          const diferenciaActual = Math.abs(fechaRecepcion - fechaActual);
          const diferenciaMasCercana = masCercana
            ? Math.abs(new Date(masCercana.fecha) - fechaActual)
            : Infinity;

          return diferenciaActual < diferenciaMasCercana ? recepcion : masCercana;
        }, null);

        // Filtrar todas las recepciones que coincidan con la fecha más cercana
        const fechaCercana = new Date(recepcionMasCercana.fecha).toISOString().split('T')[0];
        const recepcionesFiltradas = data.filter(
          (recepcion) => new Date(recepcion.fecha).toISOString().split('T')[0] === fechaCercana
        );

        // Ordenar las recepciones filtradas por el código (A-Z)
        recepcionesFiltradas.sort((a, b) => a.cod.localeCompare(b.cod));

        setRecepcionesCercanas(recepcionesFiltradas);
      } else {
        setRecepcionesCercanas([]); // No hay recepciones disponibles
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

      <div className="table-container">
        <table className="recepciones-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recepcionesCercanas.length === 0 ? (
              <tr>
                <td colSpan="4">No hay recepciones disponibles</td>
              </tr>
            ) : (
              recepcionesCercanas.map((recepcion, index) => (
                <tr key={index}>
                  <td>{recepcion.cod}</td>
                  <td>{recepcion.cant}</td>
                  <td
                    className={
                      recepcion.descripcion === "->-<- Producto nuevo: Agregar descripcion"
                        ? "highlight-orange"
                        : ""
                    }
                  >
                    {recepcion.descripcion}
                  </td>
                  <td>{recepcion.fecha}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecepcionPanel;