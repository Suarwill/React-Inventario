import React, { useState, useEffect } from 'react';
import { getRecepciones, addRecepcion, deleteRecepcion } from './recepcionService';
import './RecepcionPanel.css';

const RecepcionPanel = () => {
  const [recepciones, setRecepciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevaRecepcion, setNuevaRecepcion] = useState({
    nro: '',
    origen: 'ADM',
    destino: localStorage.getItem('sector') || '',
    tipo: 'PRODUCCION',
    cant: '',
    cod: '',
  });

  const handleLoadRecepciones = async () => {
    try {
      const data = await getRecepciones();
      setRecepciones([data]); // Cargar solo el movimiento más cercano
    } catch (error) {
      console.error(error);
    }
  };

  const handleNuevaRecepcion = async () => {
    try {
      await addRecepcion(nuevaRecepcion);
      console.log('Recepción agregada exitosamente');
      setShowModal(false);
      handleLoadRecepciones();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminarRecepcion = async (id) => {
    const confirmacion = window.confirm('¿Seguro quiere eliminar esta recepción?');
    if (!confirmacion) {
      return;
    }

    try {
      await deleteRecepcion(id);
      console.log(`Recepción con ID ${id} eliminada`);
      handleLoadRecepciones();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaRecepcion({ ...nuevaRecepcion, [name]: value });
  };

  useEffect(() => {
    handleLoadRecepciones();
  }, []);

  return (
    <div className="panel-overlay">
      <h2>Recepciones</h2>
      <button className="main-button" onClick={() => setShowModal(true)}>
        Ingresar Nueva Recepción
      </button>

      <table className="recepciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Número</th>
            <th>Cantidad</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recepciones.length === 0 ? (
            <tr>
              <td colSpan="6">No hay recepciones disponibles</td>
            </tr>
          ) : (
            recepciones.map((recepcion, index) => (
              <tr key={index}>
                <td>{recepcion.fecha}</td>
                <td>{recepcion.nro}</td>
                <td>{recepcion.cant}</td>
                <td>{recepcion.cod}</td>
                <td>{recepcion.descripcion}</td>
                <td>
                  <button
                    className="main-button"
                    onClick={() => handleEliminarRecepcion(recepcion.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nueva Recepción</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNuevaRecepcion();
              }}
            >
              <label>
                Cantidad:
                <input
                  type="number"
                  name="cant"
                  value={nuevaRecepcion.cant}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Código:
                <input
                  type="text"
                  name="cod"
                  value={nuevaRecepcion.cod}
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

export default RecepcionPanel;