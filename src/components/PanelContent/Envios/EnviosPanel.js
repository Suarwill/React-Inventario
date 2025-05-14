import React, { useState, useEffect } from 'react';
import {
  getEnvios,
  addEnvio,
  deleteEnvio,
} from './enviosService';
import './EnviosPanel.css';

const EnviosPanel = () => {
  const [envios, setEnvios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoEnvio, setNuevoEnvio] = useState({
    destino: '',
    comentario: '',
  });

  const handleLoadEnvios = async () => {
    try {
      const data = await getEnvios();
      setEnvios(data.slice(0, 7)); // Mostrar solo los últimos 7 envíos
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevoEnvio = async () => {
    try {
      await addEnvio(nuevoEnvio);
      setShowModal(false);
      handleLoadEnvios();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEnvio({ ...nuevoEnvio, [name]: value });
  };

  const handleEliminarEnvio = async (id) => {
    const confirmacion = window.confirm('¿Seguro quiere eliminar este envío?');
    if (!confirmacion) return;

    try {
      await deleteEnvio(id);
      handleLoadEnvios();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleLoadEnvios();
  }, []);

  return (
    <div className="panel-overlay">
      <h2>Envíos</h2>
      <button className="main-button" onClick={() => setShowModal(true)}>
        Ingresar Nuevo Envío
      </button>

      <table className="envios-table">
        <thead>
          <tr>
            <th>Destino</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {envios.length === 0 ? (
            <tr><td colSpan="3">No hay envíos disponibles</td></tr>
          ) : (
            envios.map((envio, index) => (
              <tr key={index}>
                <td>{envio.destino}</td>
                <td>{envio.comentario}</td>
                <td>
                  <button className="main-button" onClick={() => handleEliminarEnvio(envio.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nuevo Envío</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNuevoEnvio();
              }}
            >
              <label>
                Destino:
                <input
                  type="text"
                  name="destino"
                  value={nuevoEnvio.destino}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Comentario:
                <input
                  type="text"
                  name="comentario"
                  value={nuevoEnvio.comentario}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="main-button">Guardar</button>
                <button type="button" className="main-button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnviosPanel;