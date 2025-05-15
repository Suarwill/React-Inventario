import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister, handleSearch, handleDelete, handleEdit, handleEditProduct } from './UserManagement/UserFunctions';
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

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (!promptShownRef.current) {
      const secretKey = window.prompt('Ingrese la clave para acceder al panel de administración:');
      if (secretKey === 'ingresar') {
        setModal(null);
      } else {
        alert('Clave incorrecta. Redirigiendo al dashboard.');
        navigate('/dashboard');
      }
      promptShownRef.current = true;
    }
  }, [navigate]);

  if (!modal) {
    return null;
  }

  return (
    <div className="admin-panel">
      <h2>Panel de {usuario}</h2>

      <div className="grid-container">
        <button onClick={() => setModal('register')}>Agregar Usuario</button>
        <button onClick={() => setModal('edit')}>Editar Usuario</button>
        <button onClick={() => setModal('search')}>Buscar Usuario</button>
        <button onClick={() => setModal('delete')}>Eliminar Usuario</button>
        <button onClick={() => setModal('uploadCsv')}>Agregar Productos (CSV)</button>
        <button onClick={() => setModal('editProduct')}>Editar Producto</button>
      </div>

      {/* Modales */}
      {modal === 'register' && <RegisterUserModal handleRegister={handleRegister} setModal={setModal} showMessage={showMessage} />}
      {modal === 'edit' && <EditUserModal handleEdit={handleEdit} setModal={setModal} showMessage={showMessage} />}
      {modal === 'search' && <SearchUserModal handleSearch={handleSearch} setModal={setModal} showMessage={showMessage} />}
      {modal === 'delete' && <DeleteUserModal handleDelete={handleDelete} setModal={setModal} showMessage={showMessage} />}
      {modal === 'uploadCsv' && <UploadCsvModal file={csvFile} setFile={setCsvFile} setModal={setModal} showMessage={showMessage} />}
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