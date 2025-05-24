import React, { useState, useEffect } from 'react';
import axiosInstance from "../../axiosConfig";
import * as XLSX from 'xlsx';
import './InventariosPanel.css';

const InventariosPanel = () => {
    const [ultimaFecha, setUltimaFecha] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [tipoDiferencia, setTipoDiferencia] = useState('');
    const [tipoPanel, setTipoPanel] = useState(''); // Estado para controlar el tipo de panel

    const fetchUltimaFecha = async (tipo) => {
      try {
        const sector = localStorage.getItem('sector');
        const response = await axiosInstance.get(`/api/movimiento/inventario/av/last`, {
          params: { 
            tipo_dif: tipo,
            sector: sector
          }
        });
        setUltimaFecha(response.data.fecha);
      } catch (error) {
        console.error('Error al obtener la última fecha:', error);
      }
    };
  
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUploadFile = async () => {
      if (!file || !tipoDiferencia) {
        alert('Por favor, selecciona un archivo y un tipo de diferencia.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 6 }); // Desde la fila 7
        const usuario = localStorage.getItem('usuario'); // Obtener usuario del localStorage
        const fecha = new Date().toISOString(); // Fecha actual en formato ISO

        // Transformar los datos del archivo en el formato esperado por el backend
        const inventarios = jsonData.map((row) => ({
          tipo_dif: tipoDiferencia,
          usuario: usuario,
          fecha: fecha,
          codigo: row[0], // Columna A
          stock: row[3], // Columna D
          fisico: row[4]  // Columna E
        })).filter(item => item.codigo && item.stock && item.fisico); // Filtrar filas vacías

        try {
          await axiosInstance.post('/api/movimiento/inventario/av/add', { data: inventarios });
          alert('Archivo cargado exitosamente');
        } catch (error) {
          console.error('Error al cargar el archivo:', error);
          alert('Error al cargar el archivo');
        }
      };
      reader.readAsArrayBuffer(file);
    };
  
    return (
      <div className="inventarios-panel">
        <h2>Inventarios</h2>
        <div className="botones-principales">
          <button onClick={() => { setTipoPanel('AV'); fetchUltimaFecha('ALTO VALOR'); }}>
            Diferencia de AV
          </button>
          <button onClick={() => setTipoPanel('Categoria')}>
            Diferencia de Categoría
          </button>
        </div>

        {tipoPanel === 'AV' && (
          <div>
            {ultimaFecha && <p>Última fecha de carga: {ultimaFecha}</p>}
            <button onClick={() => setModalVisible(true)}>Cargar Archivo</button>
          </div>
        )}

        {tipoPanel === 'Categoria' && (
          <div>
            <div className="botones-inventarios">
              {['CARCASAS', 'ACCESORIOS', 'PROTECTORES', 'PENDANT'].map((tipo) => (
                <button key={tipo} onClick={() => fetchUltimaFecha(tipo)}>
                  {tipo}
                </button>
              ))}
            </div>
            {ultimaFecha && <p>Última fecha de carga: {ultimaFecha}</p>}
            <button onClick={() => setModalVisible(true)}>Cargar Archivo</button>
          </div>
        )}

        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
              <h3>Cargar Archivo XLSX</h3>
              <input type="file" accept=".xlsx" onChange={handleFileChange} />
              <h3>Seleccionar Tipo de Diferencia</h3>
              <select onChange={(e) => setTipoDiferencia(e.target.value)}>
                <option value="">Seleccionar tipo de diferencia</option>
                <option value="CARCASAS">CARCASAS</option>
                <option value="ACCESORIOS">ACCESORIOS</option>
                <option value="PROTECTORES">PROTECTORES</option>
                <option value="PENDANT">PENDANT</option>
              </select>
              <button onClick={handleUploadFile}>Cargar Archivo</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default InventariosPanel;