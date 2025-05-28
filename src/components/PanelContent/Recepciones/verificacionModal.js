import React, { useState, useRef } from 'react';

const VerificacionModal = ({ handleGuardarConteo, closeModal, conteo: initialConteo }) => {
  const [conteo, setConteo] = useState(initialConteo?.length > 0 ? initialConteo : [{ cod: '', cant: 1, descripcion: '' }]);
  const inputRefs = useRef({});

  const handleCodigoChange = (index, codigo) => {
    setConteo((prevConteo) => {
      const nuevoConteo = [...prevConteo];
      nuevoConteo[index].cod = codigo;
      return nuevoConteo;
    });
  };

  const handleCantidadChange = (index, nuevaCantidad) => {
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      alert('Cantidad no válida.');
      return;
    }
    setConteo((prevConteo) => {
      const nuevoConteo = [...prevConteo];
      nuevoConteo[index].cant = nuevaCantidad;
      return nuevoConteo;
    });
  };

  const handleGuardar = () => {
    if (conteo.some(item => !item.cod || item.cant <= 0)) {
      alert('Todos los campos deben estar completos y las cantidades deben ser mayores a 0.');
      return;
    }
    handleGuardarConteo(conteo);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
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
            {conteo.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.cod}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleCodigoChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.cant}
                    min="1"
                    onChange={(e) => handleCantidadChange(index, parseInt(e.target.value, 10))}
                  />
                </td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleGuardar}>Guardar</button>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </div>
  );
};

export default VerificacionModal;