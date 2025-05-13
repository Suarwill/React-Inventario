import React, { useState, useEffect } from 'react';
import {
  fetchDepositos,
  addDeposito,
  editDeposito,
  deleteDeposito,
} from './depositoService';
import '../PanelContent.css';

const DepositoPanel = () => {
  const [depositos, setDepositos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoDeposito, setNuevoDeposito] = useState({
    monto: '',
    comentario: '',
  });

  const usuario = 'usuario_actual'; // Reemplaza con el usuario de la sesión actual

  const handleLoadDepositos = async () => {
    try {
      const data = await fetchDepositos();
      setDepositos(data.slice(0, 7)); // Mostrar solo los últimos 7 depósitos
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevoDeposito = async () => {
    const deposito = {
      usuario,
      fecha: new Date().toISOString().split('T')[0],
      monto: nuevoDeposito.monto,
      comentario: nuevoDeposito.comentario,
    };

    try {
      await addDeposito(deposito);
      console.log('Depósito agregado exitosamente');
      setShowModal(false);
      handleLoadDepositos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoDeposito({ ...nuevoDeposito, [name]: value });
  };

  const handleEditarDeposito = (id) => {
    console.log(`Editar depósito con ID: ${id}`);
    // Implementa la lógica para editar un depósito
  };

  const handleEliminarDeposito = async (id) => {
    try {
      await deleteDeposito(id);
      console.log(`Depósito con ID ${id} eliminado`);
      handleLoadDepositos(); // Recargar la lista de depósitos
    } catch (error) {
      console.error(`Error al eliminar el depósito con ID ${id}:`, error);
    }
  };

  useEffect(() => {
    handleLoadDepositos();
  }, []);

  return (
    <div className="panel-overlay">
      <h2>Depósitos</h2>
      <button className="main-button" onClick={() => setShowModal(true)}>
        Ingresar Nuevo Depósito
      </button>

      <table className="depositos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {depositos.map((deposito, index) => (
            <tr key={index}>
              <td>{deposito.fecha}</td>
              <td>{deposito.monto}</td>
              <td>{deposito.comentario}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditarDeposito(deposito.id)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleEliminarDeposito(deposito.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nuevo Depósito</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNuevoDeposito();
              }}
            >
              <label>
                Monto:
                <input
                  type="number"
                  name="monto"
                  value={nuevoDeposito.monto}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Comentario:
                <input
                  type="text"
                  name="comentario"
                  value={nuevoDeposito.comentario}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="main-button">
                  Guardar
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositoPanel;