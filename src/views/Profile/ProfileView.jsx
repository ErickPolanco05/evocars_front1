import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const ProfileView = () => {
  // Suponiendo que userInfo está disponible en sesión y tiene la estructura adecuada
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Obtener userInfo desde localStorage

  return (
    <div className="profile-container">
      <img src={userInfo.foto} className="profile-picture" alt="Profile" />
      <h2>{userInfo.nombre}</h2>
      <p><strong>Email:</strong> {userInfo.email}</p>
      {/* No mostrar la contraseña en texto plano */}
      <p><strong>Contraseña:</strong> ********</p>
      <p><strong>Fecha de Nacimiento:</strong> {userInfo.fecha_nac}</p>
      <p><strong>Género:</strong> {userInfo.genero}</p>
      <div className="profile-buttons">
        <Link to="/profile/edit" className="button">Editar Perfil</Link>
        <Link to="/compras" className="button">Ver Compras</Link>
      </div>
    </div>
  );
};

export default ProfileView;
