import React, { useState, useEffect } from 'react';
import {
  getDepositos,
  addDeposito,
  deleteDeposito,
} from './depositoService';
import './DepositoPanel.css';

const DepositoPanel = () => {
  const [depositos, setDepositos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoDeposito, setNuevoDeposito] = useState({
    monto: '',
    comentario: '',
  });

  const handleLoadDepositos = async () => {
    try {
      console.log('Cargando depósitos...');
      const data = await getDepositos();
      setDepositos(data.slice(0, 7)); // Mostrar solo los últimos 7 depósitos
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevoDeposito = async () => {
    const deposito = {
      usuarioId: localStorage.getItem('id'),
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

  const handleEliminarDeposito = async (id) => {
    const confirmacion = window.confirm('¿Seguro quiere eliminar este depósito?');
    if (!confirmacion) {
      return; // Si el usuario cancela, no se realiza ninguna acción
    }

    try {
      await deleteDeposito(id);
      console.log(`Depósito con ID ${id} eliminado`);
      handleLoadDepositos();
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
        {depositos.length === 0 ? (
           <tr><td colSpan="4">No hay depósitos disponibles</td></tr>
          ) : (
           depositos.map((deposito, index) => (
             <tr key={index}>
               <td>{deposito.fecha}</td>
               <td>{deposito.monto}</td>
               <td>{deposito.comentario}</td>
               <td>
                 <button className="main-button" onClick={() => handleEliminarDeposito(deposito.id)}>Eliminar</button>
               </td>
             </tr>
           ))
          )}
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
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="main-button">
                  Guardar
                </button>
                <button
                  type="button"
                  className="main-button"
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