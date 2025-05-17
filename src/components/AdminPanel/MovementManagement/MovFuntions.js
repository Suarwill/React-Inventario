import axiosInstance from "../../axiosConfig";
import * as XLSX from 'xlsx';

export const handleUploadReposicion = (file, showMessage, setModal) => {
  if (!file) {
    showMessage('Por favor, seleccione un archivo XLSX.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Usar la primera hoja
      const sheet = workbook.Sheets[sheetName];

      // Convertir la hoja a JSON sin cabeceras
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Extraer datos de las columnas C, M, O, AH, AW, AY desde la fila 7
      const extractedData = jsonData.slice(6).map((row) => ({
        C: row[2],  // Columna C (índice 2) [nro]
        M: row[12], // Columna M (índice 12) [Destino]
        O: row[14], // Columna O (índice 14) [Fecha]
        AH: row[33], // Columna AH (índice 33) [tipo]
        AW: row[48], // Columna AW (índice 48) [cantidad]
        AY: row[50], // Columna AY (índice 50) [codigo]
      })).filter((row) => row.C || row.M || row.O || row.AH || row.AW || row.AY); // Filtrar filas vacías

      console.log('Datos extraídos:', extractedData);

      // Enviar los datos al servidor
      const response = await axiosInstance.post('/api/movimiento/add', { data: extractedData });
      showMessage(response.data.message || 'Archivo procesado y datos subidos correctamente.', 'success');
      setModal(null);
    } catch (error) {
      console.error('Error al procesar o subir el archivo:', error);
      showMessage(error.response?.data?.error || 'Error al procesar o subir el archivo XLSX.', 'error');
    }
  };

  reader.readAsArrayBuffer(file);
};
    
export const handleDeleteReposicion = async (nro, showMessage, setModal) => {
  if (!nro.trim()) {
      return showMessage("Por favor, complete todos los campos.", "error");
   }
  
  try {
    const response = await axiosInstance.delete(`/api/movimiento/delete/${nro}`);
      showMessage(response.data.message || "Reposición eliminada con éxito.");
      setModal(null); // Cierra el modal
  } catch (error) {
    showMessage(error.response?.data?.error || "Error al eliminar la reposición.", "error");
  }
};
