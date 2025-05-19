import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister, handleSearch, handleDelete, handleEdit } from './UserManagement/UserFunctions';
import { handleUploadCsv, handleEditProduct } from './ProductManagement/ProductFunctions';
import { RegisterUserModal, EditUserModal, SearchUserModal, DeleteUserModal } from './UserManagement/UserModals';
import { UploadCsvModal, EditProductModal } from './ProductManagement/ProductModals';
import { handleUploadReposicion, handleDeleteReposicion } from './MovementManagement/MovFuntions';
import { UploadReposicion, DeleteReposicion } from './MovementManagement/MovModals';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('username');
  const [modal, setModal] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const promptShownRef = useRef(false);
  const [ setIsAuthorized] = useState(false);
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (!promptShownRef.current) {
     const username = localStorage.getItem('username') ;
      if (username === 'admin') {
        setIsAuthorized(true); // Cambia el estado a autorizado
      } else {
        alert('No Autorizado. Redirigiendo al dashboard.');
        navigate('/admin');
      }
      promptShownRef.current = true;
    }
  }, [navigate]);

  return (
    <div className="admin-panel">
      <h2>Panel de {usuario}</h2>

      <div className="grid-container">
        <br>Manejo de Usuarios</br>
        <button className="sub-button" onClick={() => setModal('register')}>Agregar Usuario</button>
        <button className="sub-button" onClick={() => setModal('edit')}>Editar Usuario</button>
        <button className="sub-button" onClick={() => setModal('search')}>Buscar Usuario</button>
        <button className="sub-button" onClick={() => setModal('delete')}>Eliminar Usuario</button>
      </div>
      <div className="grid-container">
        <br>Manejo de Productos</br>
        <button className="sub-button" onClick={() => setModal('uploadCsv')}>Agregar Productos (CSV)</button>
        <button className="sub-button" onClick={() => setModal('editProduct')}>Editar Producto</button>
      </div>
      <div className="grid-container">
        <br>Otros</br>
        <button className="sub-button" onClick={() => setModal('uploadReposicion')}>Cargar Reposicion</button>
        <button className="sub-button" onClick={() => setModal('deleteReposicion')}>Eliminar Reposicion</button>
      </div>

      {/* Modales */}
      {modal === 'register' && <RegisterUserModal handleRegister={handleRegister} setModal={setModal} showMessage={showMessage} />}
      {modal === 'edit' && <EditUserModal handleEdit={handleEdit} setModal={setModal} showMessage={showMessage} />}
      {modal === 'search' && <SearchUserModal handleSearch={handleSearch} setModal={setModal} showMessage={showMessage} />}
      {modal === 'delete' && <DeleteUserModal handleDelete={handleDelete} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadCsv' && <UploadCsvModal handleUploadCsv={handleUploadCsv} file={csvFile} setFile={setCsvFile} setModal={setModal} showMessage={showMessage} />}
      {modal === 'editProduct' && <EditProductModal handleEditProduct={handleEditProduct} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadReposicion' && <UploadReposicion handleUploadReposicion={handleUploadReposicion} setModal={setModal} showMessage={showMessage}  />}
      {modal === 'deleteReposicion' && <DeleteReposicion handleDeleteReposicion={handleDeleteReposicion} setModal={setModal} showMessage={showMessage}  />}

      {/* Botón de cerrar sesión */}

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