import React, { useState } from 'react';

export const RegisterUserModal = ({ handleRegister, setModal, showMessage }) => {
  const [data, setData] = useState({ username: '', password: '', sector: '', zona: '' });

  return (
    <div className="modal">
      <h3>Agregar Usuario</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleRegister(data, showMessage, setModal); }}>
        <input type="text" placeholder="Nombre de usuario" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required />
        <input type="text" placeholder="Sector" value={data.sector} onChange={(e) => setData({ ...data, sector: e.target.value })} required />
        <input type="text" placeholder="Zona" value={data.zona} onChange={(e) => setData({ ...data, zona: e.target.value })} required />
        <button type="submit">Crear</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
    </div>
  );
};

export const EditUserModal = ({ handleEdit, setModal, showMessage }) => {
  const [data, setData] = useState({ editUsername: '', newUsername: '', newPassword: '', newSector: '', newZona: '' });

  return (
    <div className="modal">
      <h3>Editar Usuario</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleEdit(data, showMessage, setModal); }}>
        <input type="text" placeholder="Usuario actual" value={data.editUsername} onChange={(e) => setData({ ...data, editUsername: e.target.value })} required />
        <input type="text" placeholder="Nuevo nombre de usuario" value={data.newUsername} onChange={(e) => setData({ ...data, newUsername: e.target.value })} />
        <input type="password" placeholder="Nueva contraseña" value={data.newPassword} onChange={(e) => setData({ ...data, newPassword: e.target.value })} />
        <input type="text" placeholder="Nuevo sector" value={data.newSector} onChange={(e) => setData({ ...data, newSector: e.target.value })} />
        <input type="text" placeholder="Nueva zona" value={data.newZona} onChange={(e) => setData({ ...data, newZona: e.target.value })} />
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
    </div>
  );
};

export const SearchUserModal = ({ handleSearch, setModal, showMessage }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await handleSearch(query, setSearchResults, showMessage);
  };

  return (
    <div className="modal">
      <h3>Buscar Usuario</h3>
      <form onSubmit={handleSearchSubmit}>
        <input type="text" placeholder="Nombre de usuario" value={query} onChange={(e) => setQuery(e.target.value)} required />
        <button type="submit">Buscar</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
      <div className="search-results">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((user, index) => (
              <li key={index}>{user.username} - {user.sector} - {user.zona}</li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export const DeleteUserModal = ({ handleDelete, setModal, showMessage }) => {
  const [username, setUsername] = useState('');

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    handleDelete(username, showMessage, setModal);
  };

  return (
    <div className="modal">
      <h3>Eliminar Usuario</h3>
      <form onSubmit={handleDeleteSubmit}>
        <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <button type="submit">Eliminar</button>
        <button type="button" onClick={() => setModal(null)}>Cerrar</button>
      </form>
    </div>
  );
};