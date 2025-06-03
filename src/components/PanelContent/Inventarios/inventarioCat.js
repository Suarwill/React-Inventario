import React, { useState } from 'react';
import { fetchUltimaFecha, handleUploadFile } from './inventarioFunctions';
import './inventario.css';

const InventariosPanel = () => {
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [tipoDiferencia, setTipoDiferencia] = useState('');

  // Cargar la fecha automáticamente al montar el componente

  const fetchFecha = async (tipo) => {
    try {
      const sector = localStorage.getItem('sector');
      const fecha = await fetchUltimaFecha(tipo, sector);
      setUltimaFecha(fecha);
      setTipoDiferencia(tipo);
    } catch (error) {
      console.error('Error al obtener la última fecha:', error);
    }
  };

  const uploadFile = async () => {
    try {
      const usuario = localStorage.getItem('usuario');
      const message = await handleUploadFile(file, tipoDiferencia, usuario);
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="inventarios-panel">
      <h2>Inventarios</h2>
      <div className="botones-inventarios">
        {['ACCESORIOS', 'CARCASAS', 'PENDANT', 'PROTECTORES'].map((tipo) => (
          <button key={tipo} onClick={() => fetchFecha(tipo)}>
            {tipo}
          </button>
        ))}
      </div>

      {ultimaFecha && (
        <p>Última fecha de carga para {tipoDiferencia}: {ultimaFecha}</p>
      )}

      <button onClick={() => setModalVisible(true)}>Cargar Archivo</button>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
            <h3>Cargar Archivo XLSX</h3>
            <select
              value={tipoDiferencia}
              onChange={(e) => setTipoDiferencia(e.target.value)}>
              <option value="">Seleccione Tipo de Diferencia</option>
              <option value="ACCESORIOS">ACCESORIOS</option>
              <option value="CARCASAS">CARCASAS</option>
              <option value="PENDANT">PENDANT</option>
              <option value="PROTECTORES">PROTECTORES</option>
            </select>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={uploadFile}>Cargar Archivo</button>
            {file && <p>Archivo seleccionado: {file.name}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventariosPanel;