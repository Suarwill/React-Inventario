import React, { useState, useRef } from 'react';
import axiosInstance from '../../axiosConfig';

const VerificacionModal = ({ handleGuardarConteo, closeModal, conteo: initialConteo, nroEnvio }) => {
  const [conteo, setConteo] = useState(initialConteo?.length > 0 ? initialConteo : [{ codigo: '', cant: 0, descripcion: '' }]);
  const inputRefs = useRef({});
  const debounceTimeout = useRef(null); // Referencia para el temporizador de debounce

  const handleCodigoChange = (index, codigo) => {
    // Convertir el código a mayúsculas inmediatamente
    const codigoUpperCase = codigo.trim().toUpperCase();

    // Actualizar el estado del conteo con el nuevo código en mayúsculas
    setConteo((prevConteo) => {
      const nuevoConteo = [...prevConteo];
      nuevoConteo[index] = { ...nuevoConteo[index], codigo: codigoUpperCase }; // Actualizar solo el campo 'codigo'
      return nuevoConteo;
    });

    // Reiniciar el temporizador de debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Usar debounce para procesar el código después de x00 ms de inactividad
    debounceTimeout.current = setTimeout(async () => {
      try {
        if (codigoUpperCase.length < 5) {
          console.warn('El código es demasiado corto para procesar.');
          return;
        }

        const response = await axiosInstance.get(`/api/product/search/${codigoUpperCase}`);
        const descripcion = response.data[0]?.descripcion || 'Descripción no encontrada';

        setConteo((prevConteo) => {
          const nuevoConteo = [...prevConteo];
          nuevoConteo[index] = { ...nuevoConteo[index], descripcion, cant: 1 }; // Actualizar descripción y cantidad

          // Agregar una nueva fila vacía al final
          nuevoConteo.push({ codigo: '', cant: 0, descripcion: '' });
          return nuevoConteo;
        });

        // Enfocar automáticamente el campo de código de la nueva fila
        setTimeout(() => {
          const nuevaFilaIndex = index + 1;
          setTimeout(() => {
            if (inputRefs.current[nuevaFilaIndex]) {
              inputRefs.current[nuevaFilaIndex].focus();
            }
          }, 50); // Asegurar que React haya renderizado la nueva fila
        }, 0);
      } catch (error) {
        console.error('Error al buscar el código:', error);
        alert('Error al buscar el código. Verifique la conexión o el código ingresado.');
      }
    }, 500); // Reducir el tiempo de espera para mejorar la respuesta
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
    const conteoFiltrado = conteo
      .filter(item => item.codigo.trim() !== '' && item.cant > 0) // Cambiar item.cod a item.codigo
      .map(item => ({
        ...item,
        codigo: item.codigo.toUpperCase(), // Cambiar item.cod a item.codigo
        nro_envio: nroEnvio, // Usar el número de envío pasado como propiedad
      }));

    if (conteoFiltrado.length === 0) {
      alert('Debe ingresar al menos un producto válido.');
      return;
    }

    handleGuardarConteo(conteoFiltrado); // Actualiza el conteo en el componente principal
    closeModal();
  };

  return (
    <div className="modal-overlay">
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
                    value={item.codigo}
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
                <td>{item.descripcion || 'Sin descripción'}</td>
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