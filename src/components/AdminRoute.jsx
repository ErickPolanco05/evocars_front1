import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.id_rol === 1; // Asumiendo que el rol 1 es admin
  };

  return isAdmin() ? children : <Navigate to="/login" />;
};

export default AdminRoute;