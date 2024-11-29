import React from 'react';
import './AdminPanel.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminPanel = () => {
  const location = useLocation();

  const noHeaderRoutes = ['/admin/usuarios', '/admin/productos', '/admin/permisos', '/admin/ofertas', '/admin/cupones', '/admin/dashboard'];
  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token de autenticación
    navigate('/login'); // Redirigir al login
  };
  return (
    <div className="admin-panel-container">
      <aside className="admin-sidebar">
        <div className="navbar-logo">
          <img src="/logo.png" alt="EVOCARS Logo" />
        </div>
        <nav className="admin-nav">
          <ul className="admin-nav-list">
            <li><Link to="/admin/usuarios" className="admin-nav-link">Usuarios</Link></li>
            <li><Link to="/admin/productos" className="admin-nav-link">Carros</Link></li>
            <li><Link to="/admin/cupones" className="admin-nav-link">Cupones</Link></li>
            <li><Link to="/admin/ofertas" className="admin-nav-link">Ofertas</Link></li>
            <li><Link to="/admin/dashboard" className="admin-nav-link">Dashboard</Link></li>
            <li><Link to="/profile" className="admin-nav-link">Perfil</Link></li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="admin-content">
        {!noHeaderRoutes.includes(location.pathname) && (
          <header className="admin-header">
            <h1 className="admin-header-title">Bienvenido al Panel Administrativo</h1>
            <p className="admin-header-description">Gestiona los módulos de la aplicación de manera eficiente.</p>
          </header>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;