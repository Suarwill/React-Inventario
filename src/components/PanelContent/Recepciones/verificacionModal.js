import React, { useState, useRef } from 'react';
import axiosInstance from '../../axiosConfig';

const VerificacionModal = ({ handleGuardarConteo, closeModal, conteo: initialConteo, nroEnvio }) => {
  const [conteo, setConteo] = useState(initialConteo?.length > 0 ? initialConteo : [{ cod: '', cant: 0, descripcion: '' }]);
  const inputRefs = useRef({});
  const debounceTimeout = useRef(null); // Referencia para el temporizador de debounce

  const handleCodigoChange = (index, codigo) => {
    setConteo((prevConteo) => {
      const nuevoConteo = [...prevConteo];
      nuevoConteo[index].cod = codigo;
      return nuevoConteo;
    });

    // Reiniciar el temporizador de debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

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
          nuevoConteo[index] = { cod: codigo, cant: 1, descripcion }; // Cambiar cant a 1 al ingresar un código válido
          return nuevoConteo;
        });

        // Mover el foco al siguiente input
        setTimeout(() => {
          const nextInput = inputRefs.current[index + 1];
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);

        // Agregar una nueva fila vacía si estamos en la última fila
        if (index === conteo.length - 1) {
          setConteo((prevConteo) => {
            const nuevoConteo = [...prevConteo, { cod: '', cant: 0, descripcion: '' }]; // Nueva fila con cant en 0
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
    const conteoFiltrado = conteo
      .filter(item => item.cod.trim() !== '' && item.cant > 0)
      .map(item => ({
        ...item,
        cod: item.cod.toUpperCase(), // Convertir el código a mayúsculas
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