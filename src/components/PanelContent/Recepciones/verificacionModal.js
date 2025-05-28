import React, { useState, useRef } from 'react';
import axiosInstance from '../../axiosConfig';

const VerificacionModal = ({ handleGuardarConteo, closeModal, conteo: initialConteo }) => {
  const [conteo, setConteo] = useState(initialConteo?.length > 0 ? initialConteo : [{ cod: '', cant: 1, descripcion: '' }]);
  const debounceTimeout = useRef(null); // Referencia para el temporizador
  const inputRefs = useRef({}); // Referencias dinámicas para los inputs

  const handleCodigoChange = (index, codigo) => {
    if (!codigo.trim()) {
      alert('El código no puede estar vacío.');
      return;
    }

    // Reiniciar el temporizador de debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Actualizar el código en el estado inmediatamente (para mostrarlo en el input)
    setConteo((prevConteo) => {
      const nuevoConteo = [...prevConteo];
      nuevoConteo[index].cod = codigo;
      return nuevoConteo;
    });

    // Usar debounce para procesar el código completo después de 200 ms de inactividad
    debounceTimeout.current = setTimeout(async () => {
      try {
        // Verificar si el código tiene una longitud mínima esperada (por ejemplo, 5 caracteres)
        if (codigo.length < 5) {
          console.warn('El código es demasiado corto para procesar.');
          return;
        }

        const response = await axiosInstance.get(`/api/product/search/${codigo}`);
        const descripcion = response.data[0]?.descripcion || 'Descripción no encontrada';

        setConteo((prevConteo) => {
          const nuevoConteo = [...prevConteo];
          nuevoConteo[index] = { cod: codigo, cant: 1, descripcion };
          return nuevoConteo;
        });

        // Agregar una nueva fila vacía si estamos en la última fila
        if (index === conteo.length - 1) {
          setConteo((prevConteo) => {
            const nuevoConteo = [...prevConteo, { cod: '', cant: 1, descripcion: '' }];
            return nuevoConteo;
          });

          // Esperar a que React actualice el DOM y luego enfocar el nuevo input
          setTimeout(() => {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
              nextInput.focus();
            }
          }, 0);
        }
      } catch (error) {
        console.error('Error al buscar el código:', error);
        alert('Error al buscar el código. Verifique la conexión o el código ingresado.');
      }
    }, 200); // Reducir el tiempo de espera para mejorar la respuesta
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
                  ref={(el) => (inputRefs.current[index] = el)} // Asignar referencia al input
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