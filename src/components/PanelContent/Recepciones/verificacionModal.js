import React from 'react';

const VerificacionModal = ({
  conteo,
  handleCantidadChange,
  handleScan,
  handleEnviarConteo,
  closeModal,
}) => {
  return (
    <div className="modal">
      <h3>Agregar Verificación</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {conteo.map((item) => (
            <tr key={item.cod}>
              <td>{item.cod}</td>
              <td>
                <input
                  type="number"
                  value={item.cant}
                  min="1"
                  onChange={(e) => {
                    const nuevaCantidad = parseInt(e.target.value, 10);
                    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                      alert('Cantidad no válida.');
                      return;
                    }
                    handleCantidadChange(item.cod, nuevaCantidad);
                  }}
                />
              </td>
              <td>{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleScan(prompt('Escanea el código de barras:'))}>
        Escanear
      </button>
      <button onClick={handleEnviarConteo}>Enviar</button>
      <button onClick={closeModal}>Cerrar</button>
    </div>
  );
};

export default VerificacionModal;