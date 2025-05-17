import React, { useState } from "react";

export const UploadReposicion = ({ handleUploadReposicion, setModal, showMessage }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processFile = (e) => {
    e.preventDefault();
    handleUploadReposicion(file, showMessage, setModal);
  };

  return (
    <div className="modal">
      <h3>Cargar Reposición</h3>
      <p>Seleccione un archivo XLSX para procesar los datos.</p>
      <form onSubmit={processFile}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Procesar Archivo</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
    </div>
  );
};

export const DeleteReposicion = ({ nro, setNro, handleDeleteReposicion, setModal }) => (
  <div className="modal">
    <h3>Eliminar Reposición</h3>
    <p>Ingrese el número de reposición a eliminar.</p>
    <form onSubmit={(e) => handleDeleteReposicion(nro, e)}>
      <input
        type="text"
        placeholder="Número de reposición"
        value={nro}
        onChange={(e) => setNro(e.target.value)}
        required
      />
      <button type="submit">Eliminar</button>
      <button type="button" onClick={() => setModal(null)}>Cerrar</button>
    </form>
  </div>
);