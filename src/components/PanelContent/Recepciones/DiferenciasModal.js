import React from 'react';

const DiferenciasModal = ({ diferencias, closeModal }) => {
  if (!diferencias || diferencias.length === 0) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Diferencias</h3>
          <p>No hay diferencias para mostrar.</p>
          <button onClick={closeModal}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Diferencias</h3>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {diferencias.map((diferencia, index) => (
              <tr key={index}>
                <td>{diferencia.cod}</td>
                <td>{diferencia.cantidad}</td>
                <td>{diferencia.descripcion}</td>
                <td>{diferencia.diferencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </div>
  );
};

export default DiferenciasModal;