import React, { useEffect, useState } from 'react';
import { fetchUltimosEnvios, enviarConteo } from './verificacionService';
import VerificacionModal from './verificacionModal';
import DiferenciasModal from './DiferenciasModal';

const VerificacionPanel = () => {
  const [enviosAgrupados, setEnviosAgrupados] = useState([]);
  const [conteo, setConteo] = useState([]);
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  // Obtener envíos al cargar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const enviosData = await fetchUltimosEnvios();
        const agrupados = agruparEnvios(enviosData);
        setEnviosAgrupados(agrupados);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarDatos();
  }, []);

  // Agrupar envíos por número de envío
  const agruparEnvios = (envios) => {
    const agrupados = envios.reduce((acc, envio) => {
      if (!acc[envio.nro_envio]) {
        acc[envio.nro_envio] = {
          nro: envio.nro_envio,
          fecha: envio.fecha,
          enviados: 0,
          recibidos: 0,
          conteo: 0,
          faltantes: 0,
          sobrantes: 0,
        };
      }

      acc[envio.nro_envio].enviados += envio.enviados || 0;
      acc[envio.nro_envio].recibidos += envio.recibidos || 0;

      // Calcular faltantes y sobrantes por código
      const faltantesPorCodigo = envio.enviados - envio.recibidos - envio.conteo;
      const sobrantesPorCodigo = envio.recibidos + envio.conteo - envio.enviados;

      acc[envio.nro_envio].faltantes += faltantesPorCodigo > 0 ? faltantesPorCodigo : 0;
      acc[envio.nro_envio].sobrantes += sobrantesPorCodigo > 0 ? sobrantesPorCodigo : 0;

      return acc;
    }, {});

    return Object.values(agrupados);
  };

  const handleAgregarVerificacion = (envio) => {
    setSelectedEnvio(envio); // Guardar el envío seleccionado
    setModalVisible(true);
  };

  const handleConfirmarVerificacion = async (envio) => {
    const usuario = localStorage.getItem('username');
    const tipo = 'VERIFICACION';

    if (!window.confirm('¿Está seguro de que desea confirmar la verificación?')) {
      return;
    }
    if (conteo.length === 0) {
      alert('Debe ingresar al menos un conteo antes de confirmar la verificación.');
      return;
    }
    if (conteo.some(item => !item.cod || item.cant <= 0)) {
      alert('Todos los conteos deben tener un código válido y una cantidad mayor a cero.');
      return;
    }

    try {
      const conteos = conteo.map((item) => ({
        tipo,
        cant: item.cant,
        cod: item.cod,
        nro_envio: envio.nro,
        usuario,
      }));

      await enviarConteo(conteos);

      alert('Verificación confirmada correctamente.');
      setConteo([]); // Limpiar el conteo después de confirmar
    } catch (err) {
      alert('Error al confirmar la verificación.');
    }
  };

  const handleGuardarConteo = (nuevoConteo) => {
    setConteo(nuevoConteo); // Actualiza el estado de conteo
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleVerDiferencias = (envio) => {
    if (!envio) {
      alert('No hay detalles disponibles para este envío.');
      return;
    }

    setSelectedEnvio(envio);
    setModalVisible2(true);
  };

  return (
    <div>
      <h2>Últimos Envíos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && enviosAgrupados.length === 0 && <p>No se encontraron envíos recientes.</p>}
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
          {enviosAgrupados.map((envio, index) => (
            <tr key={index}>
              <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
              <td>{envio.nro}</td>
              <td>{envio.enviados}</td>
              <td>{envio.recibidos + envio.conteo}</td>
              <td>{envio.faltantes}</td>
              <td>{envio.sobrantes}</td>
              <td>
                <button className='main-button' onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
                <button className='main-button' onClick={() => handleVerDiferencias(envio)}>Ver Diferencias</button>
                <button className='main-button' onClick={() => handleConfirmarVerificacion(envio)}>Confirmar Verificación</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && selectedEnvio && (
        <VerificacionModal
          conteo={conteo}
          nroEnvio={selectedEnvio.nro}
          handleGuardarConteo={setConteo}
          closeModal={closeModal}
        />
      )}
      {modalVisible2 && selectedEnvio && (
        <DiferenciasModal
          diferencias={selectedEnvio.diferencias}
          closeModal={() => setModalVisible2(false)}
        />
      )}
    </div>
  );
};

export default VerificacionPanel;