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
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [enviosCalculados, setEnviosCalculados] = useState([]);

  // Obtener envíos al cargar el componente
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

  // Recalcular envíos cuando cambie el conteo o los envíos
  useEffect(() => {
    console.log('Estado de conteo actualizado:', conteo); // Depuración
    const recalcularEnvios = envios.map((envio) => {
      const cantidadVerificada = (conteo || [])
        .filter(item => item.nro_envio === envio.nro)
        .reduce((total, item) => total + item.cant, 0);

      let faltantes = 0;
      let sobrantes = 0;

      // Agrupar envíos y conteo por código y calcular faltantes y sobrantes
      const agrupados = (envio.detalles || []).reduce((acc, item) => {
        acc[item.cod] = {
          cantidadEnvio: (acc[item.cod]?.cantidadEnvio || 0) + item.cant,
        };
        return acc;
      }, {});

      (conteo || []).forEach((item) => {
        if (item.nro_envio === envio.nro) {
          agrupados[item.cod] = {
            ...agrupados[item.cod],
            cantidadConteo: (agrupados[item.cod]?.cantidadConteo || 0) + item.cant,
          };
        }
      });

      // Calcular faltantes y sobrantes
      Object.entries(agrupados).forEach(([cod, { cantidadEnvio = 0, cantidadConteo = 0 }]) => {
        const diferencia = cantidadEnvio - cantidadConteo;

        if (diferencia < 0) {
          sobrantes += Math.abs(diferencia); // Diferencia positiva suma a sobrantes
        } else if (diferencia > 0) {
          faltantes += Math.abs(diferencia); // Diferencia negativa suma a faltantes
        }
      });

      // Verificar códigos que están en conteo pero no en envíos
      (conteo || [])
        .filter(item => item.nro_envio === envio.nro && !agrupados[item.cod])
        .forEach((item) => {
          sobrantes += item.cant; // Todo lo que no está en envíos se considera sobrante
        });

      return {
        ...envio,
        cantidadVerificada,
        faltantes: Math.abs(faltantes), // Retornar el absoluto de faltantes
        sobrantes: Math.abs(sobrantes), // Retornar el absoluto de sobrantes
      };
    });

    setEnviosCalculados(recalcularEnvios);
  }, [conteo, envios]);

  const handleAgregarVerificacion = (envio) => {
    setSelectedEnvio(envio); // Guardar el envío seleccionado
    setModalVisible(true);
  };

  const handleConfirmarVerificacion = async (envio) => {
    const usuario = localStorage.getItem('usuario');
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
      await Promise.all(
        conteo.map((item) =>
          enviarConteo({
            tipo,
            cant: item.cant,
            cod: item.cod,
            usuario,
          })
        )
      );
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
    if (!Array.isArray(envio.detalles) || envio.detalles.length === 0) {
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
      const cantidadConteo = (conteo || [])
        .filter(item => item.nro_envio === envio.nro && item.cod === cod)
        .reduce((total, item) => total + item.cant, 0) || 0;

      const diferencia = cantidadEnvio - cantidadConteo;

      return {
        cod,
        cantidad: cantidadEnvio,
        descripcion,
        diferencia,
      };
    }).filter(diferencia => diferencia.diferencia !== 0);

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
          {enviosCalculados.map((envio) => (
            <tr key={envio.nro}>
              <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
              <td>{envio.nro}</td>
              <td>{envio.cantidadEnviada}</td>
              <td>{envio.cantidadVerificada}</td>
              <td>{envio.faltantes}</td>
              <td>{envio.sobrantes}</td>
              <td>
                <button onClick={() => handleAgregarVerificacion(envio)}>Agregar Verificación</button>
                <button onClick={() => handleVerDiferencias(envio)}>Ver Diferencias</button>
                <button onClick={() => handleConfirmarVerificacion(envio)}>Confirmar Verificación</button>
              </td>
            </tr>
          ))}
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