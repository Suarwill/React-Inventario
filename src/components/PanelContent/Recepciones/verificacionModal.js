import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';

const VerificacionModal = ({ handleGuardarConteo, closeModal, conteo: initialConteo }) => {

  const [conteo, setConteo] = useState(initialConteo?.length > 0 ? initialConteo : [{ cod: '', cant: 1, descripcion: '' }]);

  const handleCodigoChange = async (index, codigo) => {
    if (!codigo.trim()) {
      alert('El código no puede estar vacío.');
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/product/search/${codigo}`);
      console.log('Respuesta del servidor:', response.data);
      const descripcion = response.data[0]?.descripcion || 'Descripción no encontrada';

      setConteo((prevConteo) => {
        const nuevoConteo = [...prevConteo];
        nuevoConteo[index] = { cod: codigo, cant: 1, descripcion };
        return nuevoConteo;
      });

      // Agregar una nueva fila vacía si estamos en la última fila
      if (index === conteo.length - 1) {
        setConteo((prevConteo) => [...prevConteo, { cod: '', cant: 1, descripcion: '' }]);
      }
    } catch (error) {
      console.error('Error al buscar el código:', error);
      alert('Error al buscar el código. Verifique la conexión o el código ingresado.');
    }
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
    handleGuardarConteo(conteo);
    closeModal();
  };

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
          {conteo.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={item.cod}
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
  );
};

export default VerificacionModal;