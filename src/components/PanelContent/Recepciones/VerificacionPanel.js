import React, { useEffect, useState } from 'react';
import {
  fetchUltimosEnvios,
  fetchProductos,
  enviarConteo,
  agruparEnviosPorNumero,
  calcularCantidadVerificada,
  calcularDiferencia,
} from './verificacionService';
import VerificacionModal from './verificacionModal';

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
        const groupedData = agruparEnviosPorNumero(data);
        setEnvios(groupedData);
      } catch (err) {
        setError(err.message);
      }
    };
    obtenerEnvios();
  },[]);

  const handleAgregarVerificacion = async (envio) => {
    setSelectedEnvio(envio);
    setModalVisible(true);
    try {
      const productosData = await fetchProductos();
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar los productos.');
      closeModal(); // Cerrar el modal si ocurre un error
    }
  };

  const handleConfirmarVerificacion = async (envio) => {
    const usuario = localStorage.getItem('usuario'); // Obtener el usuario desde localStorage
    const tipo = 'VERIFICACION';
    const nro_envio = envio.nro;

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
      alert('Verificación confirmada correctamente.');
    } catch (err) {
      alert('Error al confirmar la verificación.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEnvio(null);
    setConteo([]);
  };

  const handleScan = (codigo) => {
    if (!codigo) {
      alert('Código no válido.');
      return;
    }

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
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      alert('Cantidad no válida.');
      return;
    }

    setConteo((prevConteo) =>
      prevConteo.map((item) =>
        item.cod === codigo ? { ...item, cant: nuevaCantidad } : item
      )
    );
  };

  return (
    <div>
      <h2>Últimos Envíos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && envios.length === 0 && <p>No se encontraron envíos recientes.</p>}
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Número de Envío</th>
            <th>Cantidad Enviada</th>
            <th>Cantidad Verificada</th>
            <th>Diferencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => {
            const cantidadVerificada = calcularCantidadVerificada(conteo, envio.nro);
            const diferencia = calcularDiferencia(envio.cantidadEnviada, cantidadVerificada);

            return (
              <tr key={envio.nro}>
                <td>{new Date(envio.fecha).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                  })}</td>
                <td>{envio.nro}</td>
                <td>{envio.cantidadEnviada}</td>
                <td>{cantidadVerificada}</td>
                <td>{diferencia}</td>
                <td>
                  <button onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
                  <button onClick={() => handleConfirmarVerificacion(envio)}>Confirmar Verificación</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalVisible && (
        <VerificacionModal
          conteo={conteo}
          handleCantidadChange={handleCantidadChange}
          handleScan={handleScan}
          handleEnviarConteo={() => alert('Conteo enviado.')}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default VerificacionPanel;