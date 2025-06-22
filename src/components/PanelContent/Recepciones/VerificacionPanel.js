import React, { useEffect, useState } from 'react';
import { fetchUltimosEnvios, enviarConteo } from './verificacionService';
import VerificacionModal from './verificacionModal';
import DiferenciasModal from './DiferenciasModal';
import './RecepcionPanel.css';

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

        // Verificar los códigos de conteo y alinearlos con los envíos
        const conteoVerificado = conteo.map((item) => {
          const envioRelacionado = enviosData.find(
            (envio) => envio.codigo.trim().toUpperCase() === item.codigo.trim().toUpperCase()
          );

          if (envioRelacionado) {
            return {
              ...item,
              fecha: envioRelacionado.fecha,
              nro_envio: envioRelacionado.nro,
            };
          } else {
            // Si no hay un envío relacionado, mantener el item sin cambios
            return item;
          }
        });

        // Agrupar envíos y realizar los cálculos
        const agrupados = agruparEnvios(enviosData, conteoVerificado);
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
          detalles: [], // Inicializar detalles como un array vacío
        };
      }

      // Sumar enviados
      acc[envio.fecha].enviados += Number(envio.enviados) || 0;

      // Sumar recibidos
      acc[envio.fecha].recibidos += Number(envio.recibidos) || 0;

      // Filtrar conteos relacionados con el código del envío
      const conteoRelacionado = conteo.filter(
        (item) => item.codigo.trim().toUpperCase() === envio.codigo.trim().toUpperCase()
      );

      // Sumar las cantidades del conteo relacionado
      const sumaConteo = conteoRelacionado.reduce((total, item) => total + Number(item.cant), 0);

      // Calcular faltantes y sobrantes
      const diferencia = Number(envio.enviados) - (Number(envio.recibidos) + sumaConteo);
      if (diferencia > 0) {
        acc[envio.fecha].faltantes += diferencia; // Sumar a faltantes si es positivo
      } else {
        acc[envio.fecha].sobrantes += Math.abs(diferencia); // Sumar a sobrantes si es negativo
      }

      // Agregar calculoRecibidos al envío
      envio.calculoRecibidos = Number(envio.recibidos) + sumaConteo;

      // Agregar detalles al envío agrupado
      acc[envio.fecha].detalles.push({
        codigo: envio.codigo,
        enviados: envio.enviados,
        recibidos: envio.recibidos,
        descripcion: envio.descripcion || 'Sin descripción',
        calculoRecibidos: envio.calculoRecibidos,
      });

      return acc;
    }, {});

    // Verificar si hay códigos en conteo que no están en los envíos
    conteo.forEach((item) => {
      const codigoExiste = envios.some(
        (envio) => envio.codigo.trim().toUpperCase() === item.codigo.trim().toUpperCase()
      );

      if (!codigoExiste) {
        // Buscar el envío seleccionado para usar su fecha y número
        const envioSeleccionado = envios.find(
          (envio) => envio.nro === item.nro_envio
        );

        const fechaValida = envioSeleccionado ? envioSeleccionado.fecha : "Sin Fecha";

        if (!agrupados[fechaValida]) {
          agrupados[fechaValida] = {
            fecha: fechaValida,
            enviados: 0,
            recibidos: 0,
            faltantes: 0,
            sobrantes: 0,
            detalles: [], // Inicializar detalles como un array vacío
          };
        }

        agrupados[fechaValida].sobrantes += Number(item.cant) || 0;

        // Agregar el detalle faltante
        agrupados[fechaValida].detalles.push({
          codigo: item.codigo,
          enviados: 0,
          recibidos: 0,
          descripcion: item.descripcion || 'Sin descripción',
          calculoRecibidos: Number(item.cant),
        });
      }
    });

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
    if (conteo.some(item => !item.codigo || item.cant <= 0)) {
      alert('Todos los conteos deben tener un código válido y una cantidad mayor a cero.');
      return;
    }

    try {
      const conteos = conteo.map((item) => ({
        tipo: tipo,
        cant: item.cant,
        cod: item.codigo,
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
              calculoRecibidos: envio.calculoRecibidos + nuevoConteo.reduce((total, item) => total + item.cant, 0), // Actualizar calculoRecibidos
              detalles: [
                ...envio.detalles, // Mantener los detalles existentes
                ...nuevoConteo.map((item) => ({
                  codigo: item.codigo,
                  enviados: 0, // En este caso, enviados no cambia
                  recibidos: item.cant, // Agregar la cantidad recibida del conteo
                  descripcion: item.descripcion || 'Sin descripción', // Asegurar que haya una descripción
                  calculoRecibidos: item.cant, // Actualizar calculoRecibidos
                })),
              ],
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

    // Buscar el envío actualizado en enviosAgrupados
    const envioActualizado = enviosAgrupados.find((e) => e.nro === envio.nro);

    if (!envioActualizado) {
      alert('No se encontraron datos actualizados para este envío.');
      return;
    }

    // Verificar si el envío tiene detalles
    if (!envioActualizado.detalles || !Array.isArray(envioActualizado.detalles)) {
      alert('El envío no contiene detalles válidos.');
      return;
    }

    // Calcular diferencias para los detalles del envío actualizado
    const diferencias = envioActualizado.detalles.map((detalle) => {
      const diferencia = Number(detalle.enviados) - Number(detalle.calculoRecibidos || 0); // Usar calculoRecibidos
      return {
        cod: detalle.codigo,
        descripcion: detalle.descripcion || 'Sin descripción', // Asegurar que haya una descripción
        diferencia: diferencia,
      };
    });

    // Filtrar diferencias relevantes (faltante o sobrante distinto de 0)
    const diferenciasFiltradas = diferencias.filter(
      (diferencia) => diferencia.diferencia !== 0
    );

    if (diferenciasFiltradas.length === 0) {
      alert('No hay diferencias para mostrar.');
      return;
    }

    // Asignar las diferencias al envío seleccionado
    setSelectedEnvio({ ...envioActualizado, diferencias: diferenciasFiltradas });
    setModalVisible2(true);
  };

  return (
    <div className="panel-overlay">
      <h2>Últimos Envíos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && enviosAgrupados.length === 0 && <p>No se encontraron envíos recientes.</p>}
      <table className='recepciones-table'>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cantidad Enviada</th>
            <th>Cantidad Verificada</th>
            <th>Faltantes</th>
            <th>Sobrantes</th>
            <th width="300px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {enviosAgrupados.map((envio, index) => (
            <tr key={index}>
              <td>{new Date(envio.fecha).toLocaleDateString('es-ES')}</td>
              <td>{envio.enviados}</td>
              <td>{envio.enviados - envio.faltantes + envio.sobrantes}</td>
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