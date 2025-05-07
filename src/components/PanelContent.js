import React from 'react';
import './PanelContent.css';

const PanelContent = ({ selected, envioData, setEnvioData }) => {
  const handleLoadEnvio = async () => {
    try {
      // Simulación de carga (reemplaza con tu API real)
      const envio = await fetch('/api/envios/ultimo');
      const envioJson = await envio.json();

      const productosConDescripcion = await Promise.all(
        envioJson.detalles.map(async (item) => {
          const res = await fetch(`/api/productos/${item.codigo}`);
          const prod = await res.json();
          return { ...item, descripcion: prod.descripcion };
        })
      );

      setEnvioData({
        nro_envio: envioJson.nro_envio,
        fecha: envioJson.fecha,
        detalles: productosConDescripcion
      });
    } catch (error) {
      console.error('Error al cargar envío:', error);
    }
  };

  if (selected === 'Envío desde Matriz') {
    return (
      <div className="panel-overlay">
        <h2>Último Envío desde Matriz</h2>
        <button className="main-button" onClick={handleLoadEnvio}>
          Cargar último Envío
        </button>

        {envioData && (
          <>
            <p><strong>Fecha de Producción:</strong> {envioData.fecha}</p>
            <p><strong>Nro de Envío:</strong> {envioData.nro_envio}</p>

            <table className="envio-table">
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Código</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {envioData.detalles.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cantidad}</td>
                    <td>{item.codigo}</td>
                    <td>{item.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="panel-overlay">
      <h2>{selected}</h2>
      {/* Puedes añadir contenido por sección si lo deseas */}
    </div>
  );
};

export default PanelContent;