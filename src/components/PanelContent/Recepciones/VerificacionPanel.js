import React, { useEffect, useState } from 'react';
import {
  fetchUltimosEnvios,
  enviarConteo,
  agruparEnviosPorNumero,
  calcularCantidadVerificada,
  calcularDiferencia,
} from './verificacionService';
import VerificacionModal from './verificacionModal';

const VerificacionPanel = () => {
  const [envios, setEnvios] = useState([]);
  const [conteo, setConteo] = useState([]);
  const [productos, setProductos] = useState([]); // Estado para almacenar productos
  const [selectedEnvio, setSelectedEnvio] = useState(null); // Estado inicializado
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
  }, []);

  const handleAgregarVerificacion = (envio) => {
    setSelectedEnvio(envio);
    setModalVisible(true);
  };

  const handleConfirmarVerificacion = async (envio) => {
    const usuario = localStorage.getItem('usuario');
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
                <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
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
          handleGuardarConteo={setConteo}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default VerificacionPanel;