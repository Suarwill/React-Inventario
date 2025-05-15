import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister, handleSearch, handleDelete, handleEdit } from './UserManagement/UserFunctions';
import { handleUploadCsv, handleEditProduct } from './ProductManagement/ProductFunctions';
import { RegisterUserModal, EditUserModal, SearchUserModal, DeleteUserModal } from './UserManagement/UserModals';
import { UploadCsvModal, EditProductModal } from './ProductManagement/ProductModals';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('username');
  const [modal, setModal] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const promptShownRef = useRef(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // Nuevo estado para manejar la autorización

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

  if (!isAuthorized) {
    return (
      <div className="admin-panel">
        <h2>Panel de Administración</h2>
        <p>Por favor, ingrese la clave para acceder al panel de administración.</p>
      </div>
    ); // No renderiza nada hasta que el usuario esté autorizado
  }

  return (
    <div className="admin-panel">
      <h2>Panel de {usuario}</h2>

      <div className="grid-container">
        <button className="sub-button" onClick={() => setModal('register')}>Agregar Usuario</button>
        <button className="sub-button" onClick={() => setModal('edit')}>Editar Usuario</button>
        <button className="sub-button" onClick={() => setModal('search')}>Buscar Usuario</button>
        <button className="sub-button" onClick={() => setModal('delete')}>Eliminar Usuario</button>
        <button className="sub-button" onClick={() => setModal('uploadCsv')}>Agregar Productos (CSV)</button>
        <button className="sub-button" onClick={() => setModal('editProduct')}>Editar Producto</button>
      </div>

      {/* Modales */}
      {modal === 'register' && <RegisterUserModal handleRegister={handleRegister} setModal={setModal} showMessage={showMessage} />}
      {modal === 'edit' && <EditUserModal handleEdit={handleEdit} setModal={setModal} showMessage={showMessage} />}
      {modal === 'search' && <SearchUserModal handleSearch={handleSearch} setModal={setModal} showMessage={showMessage} />}
      {modal === 'delete' && <DeleteUserModal handleDelete={handleDelete} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadCsv' && <UploadCsvModal handleUploadCsv={handleUploadCsv} file={csvFile} setFile={setCsvFile} setModal={setModal} showMessage={showMessage} />}
      {modal === 'editProduct' && <EditProductModal handleEditProduct={handleEditProduct} setModal={setModal} showMessage={showMessage} />}

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