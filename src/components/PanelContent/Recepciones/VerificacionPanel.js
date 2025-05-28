import React, { useEffect, useState } from 'react';
import {
  fetchUltimosEnvios,
  enviarConteo,
  agruparEnviosPorNumero
} from './verificacionService';
import VerificacionModal from './verificacionModal';
import DiferenciasModal from './diferenciasModal';

const VerificacionPanel = () => {
  const [envios, setEnvios] = useState([]);
  const [conteo, setConteo] = useState([]);
  const [selectedEnvio, setSelectedEnvio] = useState(null); // Estado inicializado
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);


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

  const handleGuardarConteo = (conteo) => {
    setConteo(conteo);
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  const handleVerDiferencias = (envio) => {
    setSelectedEnvio(envio);
    setModalVisible2(true);
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
            <th>Faltantes</th>
            <th>Sobrantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => {
            const cantidadVerificada = 'en construccion';
            const faltantes = 'en construccion';
            const sobrantes = 'en construccion';

            return (
              <tr key={envio.nro}>
                <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
                <td>{envio.nro}</td>
                <td>{envio.cantidadEnviada}</td>
                <td>{cantidadVerificada}</td>
                <td>{faltantes}</td>
                <td>{sobrantes}</td>
                <td>
                  <button onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
                  <button onClick={() => handleVerDiferencias(envio)}>Ver Diferencias</button>
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
          handleCerrarModal={handleCerrarModal}
        />
      )}
    </div>
  );
};

export default VerificacionPanel;