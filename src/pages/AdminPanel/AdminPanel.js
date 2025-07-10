import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister, handleSearch, handleDelete, handleEdit } from './UserManagement/UserFunctions';
import { handleUploadCsv, handleEditProduct } from './ProductManagement/ProductFunctions';
import { RegisterUserModal, EditUserModal, SearchUserModal, DeleteUserModal } from './UserManagement/UserModals';
import { UploadCsvModal, EditProductModal } from './ProductManagement/ProductModals';
import { handleUploadReposicion, handleDeleteReposicion } from './MovementManagement/MovFuntions';
import { UploadReposicion, DeleteReposicion } from './MovementManagement/MovModals';
import Navbar from '../../components/Navbar/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [nro, setNro] = useState(""); // Estado para el número de reposición
  const promptShownRef = useRef(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (!promptShownRef.current) {
      const username = localStorage.getItem('username');
      
      if (username === 'ADMIN') {
        setIsAuthorized(true);
      } else {
        alert('No Autorizado. Redirigiendo al dashboard.');
        navigate('/dashboard');
      }
      promptShownRef.current = true;
    }
  }, [navigate]);

  const sector = localStorage.getItem('sector') || 'sector';

  // Si no está autorizado, no renderiza el panel
  if (!isAuthorized) {
    return (
      <div className="admin-panel">
        <h2>Panel de Administración</h2>
        <p>No autorizado. Redirigiendo...</p>
      </div>
    );
  }

  return (

    <div className="admin-panel">
      <Navbar sector={sector} />
      <div className="grid-container">
        <h3>Manejo de Usuarios</h3>
        <div className="botones">
          <button className="sub-button" onClick={() => setModal('register')}>Agregar Usuario</button>
          <button className="sub-button" onClick={() => setModal('edit')}>Editar Usuario</button>
          <button className="sub-button" onClick={() => setModal('search')}>Buscar Usuario</button>
          <button className="sub-button" onClick={() => setModal('delete')}>Eliminar Usuario</button>
        </div>
      </div>
      <div className="grid-container">
        <h3>Manejo de Productos</h3>
        <div className="botones">
          <button className="sub-button" onClick={() => setModal('uploadCsv')}>Agregar Productos (CSV)</button>
          <button className="sub-button" onClick={() => setModal('editProduct')}>Editar Producto</button>
        </div>
      </div>
      <div className="grid-container">
        <h3>Otros</h3>
        <div className="botones">
          <button className="sub-button" onClick={() => setModal('uploadReposicion')}>Cargar Reposicion</button>
          <button className="sub-button" onClick={() => setModal('deleteReposicion')}>Eliminar Reposicion</button>
        </div>
      </div>

      {/* Modales */}
      {modal === 'register' && <RegisterUserModal handleRegister={handleRegister} setModal={setModal} showMessage={showMessage} />}
      {modal === 'edit' && <EditUserModal handleEdit={handleEdit} setModal={setModal} showMessage={showMessage} />}
      {modal === 'search' && <SearchUserModal handleSearch={handleSearch} setModal={setModal} showMessage={showMessage} />}
      {modal === 'delete' && <DeleteUserModal handleDelete={handleDelete} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadCsv' && <UploadCsvModal handleUploadCsv={handleUploadCsv} file={csvFile} setFile={setCsvFile} setModal={setModal} showMessage={showMessage} />}
      {modal === 'editProduct' && <EditProductModal handleEditProduct={handleEditProduct} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadReposicion' && <UploadReposicion handleUploadReposicion={handleUploadReposicion} setModal={setModal} showMessage={showMessage} />}
      {modal === 'deleteReposicion' && <DeleteReposicion nro={nro} setNro={setNro} handleDeleteReposicion={handleDeleteReposicion} setModal={setModal} showMessage={showMessage} />}

      {/* Mensajes */}
      {message && (
        <p className={`admin-message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminPanel;