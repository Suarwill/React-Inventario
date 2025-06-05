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

  // Calcular faltantes y sobrantes
  const diferenciasCalculadas = diferencias.map(diferencia => {
    const faltante = diferencia.diferencia < 0 ? Math.abs(diferencia.diferencia) : 0;
    const sobrante = diferencia.diferencia > 0 ? diferencia.diferencia : 0;
    return { ...diferencia, faltante, sobrante };
  });

  // Filtrar códigos con faltante o sobrante distinto de 0
  const diferenciasFiltradas = diferenciasCalculadas.filter(
    diferencia => diferencia.faltante !== 0 || diferencia.sobrante !== 0
  );

  if (diferenciasFiltradas.length === 0) {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Diferencias</h3>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Faltante</th>
              <th>Sobrante</th>
            </tr>
          </thead>
          <tbody>
            {diferenciasFiltradas.map((diferencia, index) => (
              <tr key={index}>
                <td>{diferencia.cod}</td>
                <td>{diferencia.cantidad}</td>
                <td>{diferencia.descripcion}</td>
                <td>{diferencia.faltante}</td>
                <td>{diferencia.sobrante}</td>
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