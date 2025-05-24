import React, { useState, useEffect } from 'react';
import { fetchUltimaFecha, handleUploadFile } from './inventarioFunctions';
import './inventario.css';

const InventariosPanel = () => {
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);

  // Cargar la fecha automáticamente al montar el componente
  useEffect(() => {
    const fetchFechaInicial = async () => {
      try {
        const sector = localStorage.getItem('sector');
        const fecha = await fetchUltimaFecha('ALTO VALOR', sector);
        setUltimaFecha(fecha);
      } catch (error) {
        console.error('Error al obtener la última fecha:', error);
      }
    };
    fetchFechaInicial();
  }, []);

  const uploadFile = async () => {
    try {
      const usuario = localStorage.getItem('usuario');
      const message = await handleUploadFile(file, 'ALTO VALOR', usuario);
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="inventarios-panel">
      <h2>Inventarios</h2>
      <div>
        {ultimaFecha ? (
          <p>Última fecha de carga: {ultimaFecha}</p>
        ) : (
          <p>Cargando última fecha...</p>
        )}
        <button onClick={() => setModalVisible(true)}>Cargar Archivo de diferencias</button>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
            <h3>Cargar Archivo XLSX</h3>
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadFile}>Cargar Archivo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventariosPanel;