import React, { useEffect, useState } from 'react';
import { fetchUltimosEnvios, enviarConteo } from './verificacionService';
import VerificacionModal from './verificacionModal';
import DiferenciasModal from './DiferenciasModal';

const VerificacionPanel = () => {
  const [envios, setEnvios] = useState([]);
  const [conteo, setConteo] = useState([]);
  const [enviosAgrupados, setEnviosAgrupados] = useState([]);
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  // Obtener envíos al cargar el componente
  useEffect(() => {
    const obtenerEnvios = async () => {
      try {
        const data = await fetchUltimosEnvios();
        setEnvios(data); // Cargar los datos directamente como elementos individuales
      } catch (err) {
        setError(err.message);
      }
    };
    obtenerEnvios();
  }, []);

  // Agrupar envíos por número de envío
  useEffect(() => {
    const agruparPorNumeroEnvio = () => {
      const agrupados = envios.reduce((acc, envio) => {
        if (!acc[envio.nro]) {
          acc[envio.nro] = {
            nro: envio.nro,
            fecha: envio.fecha,
            detalles: [],
          };
        }
        acc[envio.nro].detalles.push(envio);
        return acc;
      }, {});

      setEnviosAgrupados(Object.values(agrupados));
    };

    agruparPorNumeroEnvio();
  }, [envios]);

  // Calcular faltantes y sobrantes
  const calcularDiferencias = (envio) => {
    const cantidadVerificada = (conteo || [])
      .filter(item => item.nro_envio === envio.nro)
      .reduce((total, item) => total + item.cant, 0);

    const cantidadEnviada = envio.detalles.reduce((total, item) => total + item.cant, 0);

    const diferencia = cantidadEnviada - cantidadVerificada;

    return {
      faltantes: diferencia > 0 ? diferencia : 0,
      sobrantes: diferencia < 0 ? Math.abs(diferencia) : 0,
    };
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
      // Crear el array de conteos con los datos requeridos
      const conteos = conteo.map((item) => ({
        tipo,
        cant: item.cant,
        cod: item.cod,
        nro_envio: envio.nro,
        usuario,
      }));

      // Enviar el array de conteos al backend
      await enviarConteo(conteos);

      alert('Verificación confirmada correctamente.');
    } catch (err) {
      alert('Error al confirmar la verificación.');
    }
  };

  const handleGuardarConteo = (nuevoConteo) => {
    console.log('Nuevo conteo recibido desde el modal:', nuevoConteo); // Depuración
    setConteo(nuevoConteo); // Actualiza el estado de conteo
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleVerDiferencias = (envio) => {
    if (!envio || !envio.detalles || envio.detalles.length === 0) {
      alert('No hay detalles disponibles para este envío.');
      return;
    }

    const diferencias = envio.detalles.map((detalle) => {
      const cantidadConteo = (conteo || [])
        .filter(item => item.nro_envio === envio.nro && item.cod === detalle.cod)
        .reduce((total, item) => total + item.cant, 0);

      const diferencia = detalle.cant - cantidadConteo;

      return {
        cod: detalle.cod,
        cantidad: detalle.cant,
        descripcion: detalle.descripcion || 'Sin descripción',
        diferencia,
      };
    });

    setSelectedEnvio({ ...envio, diferencias });
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
          {enviosAgrupados.map((envio, index) => {
            const { faltantes, sobrantes } = calcularDiferencias(envio);
            const cantidadVerificada = (conteo || [])
              .filter(item => item.nro_envio === envio.nro)
              .reduce((total, item) => total + item.cant, 0);

            const cantidadEnviada = envio.detalles.reduce((total, item) => total + item.cant, 0);

            return (
              <tr key={index}>
                <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
                <td>{envio.nro}</td>
                <td>{cantidadEnviada}</td>
                <td>{cantidadVerificada}</td>
                <td>{faltantes}</td>
                <td>{sobrantes}</td>
                <td>
                  <button className='main-button' onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
                  <button className='main-button' onClick={() => handleVerDiferencias(envio)}>Ver Diferencias</button>
                  <button className='main-button' onClick={() => handleConfirmarVerificacion(envio)}>Confirmar Verificación</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalVisible && selectedEnvio && (
        <VerificacionModal
          conteo={conteo}
          nroEnvio={selectedEnvio.nro} // Pasar el número de envío como propiedad
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