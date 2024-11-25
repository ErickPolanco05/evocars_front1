import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    axios.get('https://evocars-cristian-ps-projects.vercel.app/api/usuarios')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const deleteUser = (id) => {
    axios.delete(`https://evocars-cristian-ps-projects.vercel.app/api/usuarios/${id}`)
      .then(() => setUsers(users.filter(user => user.id_usuario !== id)))
      .catch(error => console.error(error));
  };

  // Función para formatear la fecha
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(); // Esto devuelve la fecha en el formato MM/DD/YYYY
  };

  // Filtrar usuarios por nombre
  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container-unique">
      <h2 className="user-list-title-unique">Lista de Usuarios</h2>
      <div className="button-container-unique">
        <Link to="/usuarios/create" className="create-user-button-unique">Crear Nuevo Usuario</Link>
      </div>
      {/* Campo de búsqueda */}
      <div className="search-container-unique">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input-unique"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container-unique">
        <table className="user-table-unique">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de Nacimiento</th>
              <th>Género</th>
              <th>Rol</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.fecha_nac)}</td> {/* Formatear la fecha */}
                <td>{user.genero}</td>
                <td>{user.id_rol}</td>
                <td>
                  {user.foto ? (
                    <img 
                      src={user.foto.startsWith('http') ? user.foto : `https://evocars-cristian-ps-projects.vercel.app/${user.foto}`} 
                      alt="Foto de Perfil" 
                      className="user-photo-unique" 
                    />
                  ) : (
                    <span>No hay foto</span>
                  )}
                </td>
                <td className="action-buttons-unique">
                  <Link to={`/usuarios/edit/${user.id_usuario}`} className="edit-button-unique">Editar</Link>
                  <button onClick={() => deleteUser(user.id_usuario)} className="delete-button-unique">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
