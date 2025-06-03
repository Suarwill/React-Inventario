import axiosInstance from '../../axiosConfig';

export const handleUploadCsv = async (event, file, showMessage, setModal) => {
  event.preventDefault();

  if (!file) {
    return showMessage('Por favor, seleccione un archivo CSV.', 'error');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Leer el contenido del archivo CSV
    const fileContent = await file.text();
    const rows = fileContent.split('\n').filter(row => row.trim() !== '');
    
    // Validar que el archivo no tenga cabeceras y que use el separador ;
    const isValidCsv = rows.every(row => row.includes(';'));
    if (!isValidCsv) {
      return showMessage('El archivo CSV debe usar ";" como separador y no tener cabeceras.', 'error');
    }

    // Enviar el archivo al backend
    const response = await axiosInstance.post('/api/product/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    showMessage(response.data.message || 'Productos cargados con éxito.');
    setModal(null); // Cierra el modal
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al cargar el archivo CSV.', 'error');
  }
};

export const handleEditProduct = async (codigo, nuevaCategoria, showMessage, setModal) => {
  if (!codigo.trim() || !nuevaCategoria.trim()) {
    return showMessage('Por favor, complete todos los campos.', 'error');
  }

  try {
    const response = await axiosInstance.put(`/api/product/edit/${codigo}`, { categoria: nuevaCategoria });
    showMessage(response.data.message || 'Producto actualizado con éxito.');
    setModal(null); // Cierra el modal
  } catch (error) {
    showMessage(error.response?.data?.error || 'Error al editar el producto.', 'error');
  }
};