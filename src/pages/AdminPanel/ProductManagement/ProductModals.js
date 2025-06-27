import React, { useState } from 'react';

export const UploadCsvModal = ({ file, setFile, handleUploadCsv, setModal, showMessage }) => (
  <div className="modal">
    <h3>Cargar Productos (CSV)</h3>
    <p>Seleccione un archivo CSV para cargar productos.</p>
    <p>Formato esperado: código, descripción, categoría, estatus (sin encabezados).</p>
    <form onSubmit={(e) => handleUploadCsv(e, file, showMessage, setModal)}>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Cargar</button>
      <button type="button" onClick={() => setModal(null)}>Cerrar</button>
    </form>
  </div>
);

export const EditProductModal = ({ handleEditProduct, setModal, showMessage }) => {
  const [codigo, setCodigo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditProduct(codigo, nuevaCategoria, showMessage, setModal);
  };

  return (
    <div className="modal">
      <h3>Editar Producto</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Código del producto"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          required
        />
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
    </div>
  );
};