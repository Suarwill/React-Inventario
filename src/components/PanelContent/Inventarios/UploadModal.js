// filepath: /home/krisis/PROYECTOS/React-Inventario/src/components/PanelContent/Inventarios/InventariosPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './InventariosPanel.css'; // Asegúrate de crear este archivo para estilos

const InventariosPanel = () => {
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchUltimaFecha = async (tipo) => {
    try {
      const response = await axios.get(`/api/movimiento/inventario/av/last`, {
        params: { tipo_dif: tipo }
      });
      setUltimaFecha(response.data);
    } catch (error) {
      console.error('Error al obtener la última fecha:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 6 }); // Desde la fila 7

      // Aquí puedes enviar jsonData al backend
      try {
        await axios.post('/api/movimiento/inventario/av/add', { data: jsonData });
        alert('Archivo cargado exitosamente');
      } catch (error) {
        console.error('Error al cargar el archivo:', error);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <div className="inventarios-panel">
      <h2>Inventarios</h2>
      <div className="button-group">
        {['ALTO VALOR', 'CARCASAS', 'PENDANT', 'ACCESORIOS', 'PROTECTORES'].map((tipo) => (
          <button key={tipo} onClick={() => fetchUltimaFecha(tipo)}>
            {tipo}
          </button>
        ))}
      </div>
      {ultimaFecha && <p>Última fecha de carga: {ultimaFecha.fecha}</p>}
      <button onClick={handleToggleModal}>Cargar Archivo</button>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleToggleModal}>&times;</span>
            <h3>Cargar Archivo XLSX</h3>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUploadFile}>Cargar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventariosPanel;