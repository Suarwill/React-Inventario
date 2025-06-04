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
        const agrupados = agruparEnvios(enviosData, conteo);
        setEnviosAgrupados(agrupados);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarDatos();
  }, [conteo]); // Recalcular cuando cambie el conteo

  // Agrupar envíos por número de envío
  const agruparEnvios = (envios, conteo) => {
    const agrupados = envios.reduce((acc, envio) => {
      if (!acc[envio.fecha]) {
        acc[envio.fecha] = {
          fecha: envio.fecha,
          enviados: 0,
          recibidos: 0,
          faltantes: 0,
          sobrantes: 0,
        };
      }

      // Sumar enviados
      acc[envio.fecha].enviados += Number(envio.enviados) || 0;

      // Sumar recibidos
      acc[envio.fecha].recibidos += Number(envio.recibidos) || 0;

      // Filtrar conteos relacionados con el código del envío
      const conteoRelacionado = conteo.filter((item) => item.cod === envio.codigo);

      // Sumar las cantidades del conteo relacionado
      const sumaConteo = conteoRelacionado.reduce((total, item) => total + Number(item.cant), 0);

      // Calcular faltantes y sobrantes
      const diferencia = Number(envio.enviados) - (Number(envio.recibidos) + sumaConteo);
      if (diferencia > 0) {
        acc[envio.fecha].faltantes += diferencia; // Sumar a faltantes si es positivo
      } else {
        acc[envio.fecha].sobrantes += Math.abs(diferencia); // Sumar a sobrantes si es negativo
      }

      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    return Object.values(agrupados);
  };

  const handleAgregarVerificacion = (envio) => {
    setSelectedEnvio(envio); // Guardar el envío seleccionado
    setModalVisible(true);
  };

  const handleConfirmarVerificacion = async (envio) => {
    const IdUsuario = localStorage.getItem('id');
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
        tipo: tipo,
        cant: item.cant,
        cod: item.cod,
        nro_envio: envio.nro,
        IdUsuario: IdUsuario,
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

    // Actualizar la cantidad verificada en el estado enviosAgrupados
    setEnviosAgrupados((prevEnvios) =>
      prevEnvios.map((envio) =>
        envio.nro === selectedEnvio.nro
          ? {
              ...envio,
              conteo: nuevoConteo.reduce((total, item) => total + item.cant, 0), // Sumar las cantidades del conteo
              recibidos: envio.recibidos, // Mantener los valores existentes
            }
          : envio
      )
    );

    closeModal(); // Cerrar el modal
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
              <td>{envio.enviados}</td>
              <td>{envio.recibidos}</td>
              <td>{envio.faltantes}</td>
              <td>{envio.sobrantes}</td>
              <td>
                <button className="main-button" onClick={() => handleAgregarVerificacion(envio)}>
                  Agregar Verificación
                </button>
                <button className="main-button" onClick={() => handleVerDiferencias(envio)}>
                  Ver Diferencias
                </button>
                <button className="main-button" onClick={() => handleConfirmarVerificacion(envio)}>
                  Confirmar Verificación
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && selectedEnvio && (
        <VerificacionModal
          conteo={conteo}
          nroEnvio={selectedEnvio.nro}
          handleGuardarConteo={handleGuardarConteo}
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