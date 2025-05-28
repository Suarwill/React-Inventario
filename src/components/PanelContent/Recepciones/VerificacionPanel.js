import React, { useEffect, useState } from 'react';
import {
  fetchUltimosEnvios,
  enviarConteo,
  agruparEnviosPorNumero
} from './verificacionService';
import VerificacionModal from './verificacionModal';
import DiferenciasModal from './DiferenciasModal';

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

    //solicitar confirmar si envia verificación
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

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleVerDiferencias = (envio) => {
    if (!envio.detalles || envio.detalles.length === 0) {
      alert('No hay detalles disponibles para este envío.');
      return;
    }

    const diferencias = Object.entries(
      envio.detalles.reduce((acc, item) => {
        acc[item.cod] = {
          cantidadEnvio: (acc[item.cod]?.cantidadEnvio || 0) + item.cant,
          descripcion: item.descripcion || 'Sin descripción',
        };
        return acc;
      }, {})
    ).map(([cod, { cantidadEnvio, descripcion }]) => {
      const cantidadConteo = conteo
        .filter(item => item.nro_envio === envio.nro && item.cod === cod)
        .reduce((total, item) => total + item.cant, 0) || 0; // Devuelve 0 si no hay datos en conteo

      const diferencia = cantidadEnvio - cantidadConteo;

      return {
        cod,
        cantidad: cantidadEnvio,
        descripcion,
        diferencia,
      };
    }).filter(diferencia => diferencia.diferencia !== 0); // Filtrar diferencias distintas de 0

    setSelectedEnvio({ ...envio, diferencias });
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
            const cantidadVerificada = conteo
              .filter(item => item.nro_envio === envio.nro) // Filtrar por el número de envío
              .reduce((total, item) => total + item.cant, 0); // Sumar las cantidades

            // Agrupar por código y calcular faltantes
            const faltantes = Object.entries(
              envio.detalles.reduce((acc, item) => {
                acc[item.cod] = (acc[item.cod] || 0) + item.cant; // Sumar cantidades por código en envio
                return acc;
              }, {})
            ).reduce((totalFaltantes, [cod, cantidadEnvio]) => {
              const cantidadConteo = conteo
                .filter(item => item.nro_envio === envio.nro && item.cod === cod) // Filtrar por código y número de envío
                .reduce((total, item) => total + item.cant, 0); // Sumar cantidades por código en conteo

              const diferencia = cantidadEnvio - cantidadConteo; // Calcular diferencia
              return totalFaltantes + (diferencia < 0 ? Math.abs(diferencia) : 0); // Sumar solo valores negativos como absolutos
            }, 0);

            const sobrantes = Object.entries(
              envio.detalles.reduce((acc, item) => {
                acc[item.cod] = (acc[item.cod] || 0) + item.cant; // Sumar cantidades por código en envio
                return acc;
              }, {})
            ).reduce((totalSobrantes, [cod, cantidadEnvio]) => {
              const cantidadConteo = conteo
                .filter(item => item.nro_envio === envio.nro && item.cod === cod) // Filtrar por código y número de envío
                .reduce((total, item) => total + item.cant, 0); // Sumar cantidades por código en conteo

              const diferencia = cantidadEnvio - cantidadConteo; // Calcular diferencia
              return totalSobrantes + (diferencia > 0 ? Math.abs(diferencia) : 0); // Sumar solo valores positivos como absolutos
            }, 0);

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