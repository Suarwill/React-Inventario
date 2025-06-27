import * as XLSX from 'xlsx';
import axiosInstance from '../../../../components/axiosConfig';

export const fetchUltimaFecha = async (tipo, sector) => {
  try {
    const response = await axiosInstance.get(`/api/movimiento/inventario/av/last`, {
      params: { tipo_dif: tipo, sector: sector },
    });
    return response.data.fecha;
  } catch (error) {
    console.error('Error al obtener la última fecha:', error);
    throw error;
  }
};

export const handleUploadFile = async (file, tipo_dif, usuario) => {
  if (!file || !tipo_dif) {
    throw new Error('Archivo o tipo de diferencia no proporcionado.');
  }

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 6 });
        const fecha = new Date().toISOString();

        const inventarios = jsonData
          .map((row) => ({
            tipo_dif: tipo_dif,
            usuario: usuario,
            fecha: fecha,
            codigo: row[0],
            stock: row[3],
            fisico: row[4],
          }))
          .filter((item) => item.codigo && item.stock && item.fisico);

        await axiosInstance.post('/api/movimiento/inventario/av/add', { data: inventarios });
        resolve('Archivo cargado exitosamente');
      } catch (error) {
        console.error('Error al cargar el archivo:', error);
        reject('Error al cargar el archivo');
      }
    };
    reader.readAsArrayBuffer(file);
  });
};