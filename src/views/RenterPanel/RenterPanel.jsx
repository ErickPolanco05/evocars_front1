import React from 'react';
import './RenterPanel.css';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const RenterPanel = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Importar y usar useNavigate

  // Actualizar las rutas donde no se debe mostrar el header
  const noHeaderRoutes = [
    '/renter/dashboard',
    '/renter/productos',
    '/renter/ofertas',
    '/renter/cupones',
    '/renter/ofertas/new',
    '/renter/ofertas/edit',
    '/renter/cupones/new',
    '/renter/cupones/edit',
  ];

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token de autenticación
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="renter-panel-container">
      <aside className="renter-sidebar">
        <div className="navbar-logo">
          <img src="/logo.png" alt="EVOCARS Logo" />
        </div>
        <nav className="renter-nav">
          <ul className="renter-nav-list">
            <li>
              <Link
                to="/renter/dashboard"
                className={`renter-nav-link ${location.pathname === '/renter/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/renter/productos"
                className={`renter-nav-link ${location.pathname.startsWith('/renter/productos') ? 'active' : ''}`}
              >
                Vehículos
              </Link>
            </li>
            <li>
              <Link
                to="/renter/ofertas"
                className={`renter-nav-link ${location.pathname.startsWith('/renter/ofertas') ? 'active' : ''}`}
              >
                Ofertas
              </Link>
            </li>
            <li>
              <Link
                to="/renter/cupones"
                className={`renter-nav-link ${location.pathname.startsWith('/renter/cupones') ? 'active' : ''}`}
              >
                Cupones
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`renter-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Perfil
              </Link>
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="renter-content">
        {!noHeaderRoutes.includes(location.pathname) && (
          <header className="renter-header">
            <h1 className="renter-header-title">Bienvenido al Panel del Rentador</h1>
            <p className="renter-header-description">Gestiona tus reservas y vehículos de manera eficiente.</p>
          </header>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default RenterPanel;
