import React, { useEffect, useState } from 'react';
import { fetchUltimosEnvios, fetchProductos, enviarConteo } from './verificacionService';

const VerificacionPanel = () => {
  const [envios, setEnvios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [conteo, setConteo] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEnvio, setSelectedEnvio] = useState(null);

  useEffect(() => {

    const obtenerEnvios = async () => {
      try {
        const data = await fetchUltimosEnvios();
        setEnvios(data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerEnvios();
  }, []);

  const handleAgregarVerificacion = async (envio) => {
    setSelectedEnvio(envio);
    setModalVisible(true);

    try {
      const productosData = await fetchProductos();
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar los productos.');
    }
  };

  const handleScan = (codigo) => {
    const productoExistente = conteo.find((item) => item.cod === codigo);

    if (productoExistente) {
      setConteo((prevConteo) =>
        prevConteo.map((item) =>
          item.cod === codigo ? { ...item, cant: item.cant + 1 } : item
        )
      );
    } else {
      const producto = productos.find((p) => p.codigo === codigo);
      if (producto) {
        setConteo((prevConteo) => [
          ...prevConteo,
          { cod: codigo, cant: 1, descripcion: producto.descripcion },
        ]);
      } else {
        alert('Producto no encontrado.');
      }
    }
  };

  const handleCantidadChange = (codigo, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      setConteo((prevConteo) =>
        prevConteo.map((item) =>
          item.cod === codigo ? { ...item, cant: nuevaCantidad } : item
        )
      );
    }
  };

  const handleEnviarConteo = async () => {
    const usuario = localStorage.getItem('usuario'); // Obtener el usuario desde localStorage
    const tipo = 'VERIFICACION';
    const nro_envio = selectedEnvio.numero_envio;

    try {
      await Promise.all(
        conteo.map((item) =>
          enviarConteo({
            tipo,
            cant: item.cant,
            cod: item.cod,
            nro_envio,
            usuario,
          })
        )
      );
      alert('Conteo enviado correctamente.');
      closeModal();
    } catch (err) {
      alert('Error al enviar el conteo.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEnvio(null);
    setConteo([]);
  };

  return (
    <div>
      <h2>Últimos Envíos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && envios.length === 0 && <p>No se encontraron envíos recientes.</p>}
      <ul>
        {envios.map((envio) => (
          <li key={envio.numero_envio}>
            <strong>Número de Envío:</strong> {envio.numero_envio} <br />
            <strong>Fecha:</strong> {new Date(envio.fecha_envio).toLocaleString()} <br />
            <strong>Cantidad Total:</strong> {envio.cantidad_total} <br />
            <button onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
            <button onClick={() => alert(`Recepción confirmada para el envío: ${envio.numero_envio}`)}>
              Confirmar Recepción
            </button>
          </li>
        ))}
      </ul>

      {modalVisible && (
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
                      onChange={(e) => handleCantidadChange(item.cod, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td>{item.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleScan(prompt('Escanea el código de barras:'))}>Escanear</button>
          <button onClick={handleEnviarConteo}>Enviar</button>
          <button onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default VerificacionPanel;