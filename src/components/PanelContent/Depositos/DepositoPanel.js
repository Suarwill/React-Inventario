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

  const handleLoadDepositos = async () => {
    try {
      const data = await fetchDepositos();
      setDepositos(data.slice(0, 7)); // Mostrar solo los últimos 7 depósitos
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevoDeposito = async () => {
    const nuevoDeposito = {
      usuario: 1,
      fecha: new Date().toISOString().split('T')[0],
      monto: 1000,
      comentario: 'Nuevo depósito',
    };

    try {
      await addDeposito(nuevoDeposito);
      console.log('Depósito agregado exitosamente');
      handleLoadDepositos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditarDeposito = async (id) => {
    const depositoEditado = {
      usuario: 1,
      fecha: new Date().toISOString().split('T')[0],
      monto: 2000,
      comentario: 'Depósito editado',
    };

    try {
      await editDeposito(id, depositoEditado);
      console.log('Depósito editado exitosamente');
      handleLoadDepositos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminarDeposito = async (id) => {
    try {
      await deleteDeposito(id);
      console.log('Depósito eliminado exitosamente');
      handleLoadDepositos();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleLoadDepositos();
  }, []);

  return (
    <div className="panel-overlay">
      <h2>Depósitos</h2>
      <button className="main-button" onClick={handleNuevoDeposito}>
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
    </div>
  );
};

export default DepositoPanel;