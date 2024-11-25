import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home/Home';
import Cars from './views/Cars/Cars';
import Contacts from './views/Contacts/Contacts';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Ticket from './views/Ticket/Ticket';
import UserList from './views/UserList/UserList';
import UserForm from './views/UserForm/UserForm';
import ComprasList from './views/Compras/ComprasList';
import ComprasForm from './views/Compras/ComprasForm';
import ProductosList from './views/ProductosList/ProductosList';
import ProductosForm from './views/ProductosForm/ProductosForm';
import ProfileView from './views/Profile/ProfileView';
import EditProfileForm from './views/Profile/EditProfileForm';
import CarDetail from './views/CarDetail/CarDetail';
import AdminPanel from './views/AdminPanel/AdminPanel';
import RenterPanel from './views/RenterPanel/RenterPanel';
import RenterRegister from './views/RenterRegister/RenterRegister';
import DashboardA from './views/DashboardA/DashboardA';
import DashboardR from './views/DashboardR/DashboardR';
import RenterRoute from './components/RenterRoute';
import ConnectionStatus from './components/ConnectionStatus'; // Importamos el componente ConnectionStatus

// Nuevas importaciones para ofertas y cupones
import OfertasList from './views/OfertasList/OfertasList';
import OfertasForm from './views/OfertasForm/OfertasForm';
import CuponesList from './views/CuponesList/CuponesList';
import CuponesForm from './views/CuponesForm/CuponesForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Agregamos estado para conectividad
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Estado para el evento beforeinstallprompt

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (event) => {
      // Prevenir que el navegador muestre el banner por defecto
      event.preventDefault();
      // Guardar el evento para usarlo más tarde
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Función para mostrar el banner de instalación
  const showInstallBanner = () => {
    if (deferredPrompt) {
      // Mostrar un banner personalizado para la instalación
      const installBanner = document.createElement('div');
      installBanner.innerHTML = `
        <div style="position: fixed; bottom: 0; width: 100%; background-color: #333; color: white; padding: 10px; text-align: center;">
          <p>¡Instala nuestra app para una mejor experiencia!</p>
          <button id="installButton">Instalar</button>
        </div>
      `;

      document.body.appendChild(installBanner);

      const installButton = installBanner.querySelector('#installButton');
      
      // Manejar el clic en el botón de instalación
      installButton.addEventListener('click', () => {
        // Mostrar el prompt de instalación
        deferredPrompt.prompt();
        
        // Esperar la respuesta del usuario
        deferredPrompt.userChoice
          .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('El usuario aceptó la instalación');
            } else {
              console.log('El usuario rechazó la instalación');
            }
            // Eliminar el banner después de la interacción
            installBanner.remove();
          })
          .catch((error) => {
            console.error('Error al gestionar la instalación', error);
            installBanner.remove();
          });
      });
    }
  };

  return (
    <Router>
      <div>
        {/* Mostrar la barra de navegación solo si no estamos en las rutas de login o registro */}
        {!["/login", "/register", "/renter-register"].includes(window.location.pathname) && <NavBar />}

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
              path="/renter-register" 
              element={isAuthenticated ? <Navigate to="/" /> : <RenterRegister />} 
            />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/usuarios/create" element={<UserForm />} />
            <Route path="/usuarios/edit/:id" element={<UserForm />} />
            <Route path="/compras" element={<ComprasList />} />
            <Route path="/compras/new" element={<ComprasForm />} />
            <Route path="/compras/edit/:id" element={<ComprasForm />} />
            <Route path="/productos" element={<ProductosList />} />
            <Route path="/productos/new" element={<ProductosForm />} />
            <Route path="/productos/edit/:id" element={<ProductosForm />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<EditProfileForm />} />
            <Route path="/carros/:id" element={<CarDetail />} />

            {/* Rutas para ofertas */}
            <Route path="/ofertas" element={<OfertasList />} />
            <Route path="/ofertas/new" element={<OfertasForm />} />
            <Route path="/ofertas/edit/:id" element={<OfertasForm />} />

            {/* Rutas para cupones */}
            <Route path="/cupones" element={<CuponesList />} />
            <Route path="/cupones/new" element={<CuponesForm />} />
            <Route path="/cupones/edit/:id" element={<CuponesForm />} />

            {/* Rutas dentro del panel de administrador */}
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardA />} />
              <Route path="usuarios" element={<UserList />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/new" element={<ProductosForm />} />
              <Route path="productos/edit/:id" element={<ProductosForm />} />
              <Route path="ofertas" element={<OfertasList />} />
              <Route path="ofertas/new" element={<OfertasForm />} />
              <Route path="ofertas/edit/:id" element={<OfertasForm />} />
              <Route path="cupones" element={<CuponesList />} />
              <Route path="cupones/new" element={<CuponesForm />} />
              <Route path="cupones/edit/:id" element={<CuponesForm />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="profile/edit" element={<EditProfileForm />} />
            </Route>

            {/* Rutas dentro del panel de arrendador */}
            <Route path="/renter" element={<RenterPanel />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardR />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/new" element={<ProductosForm />} />
              <Route path="productos/edit/:id" element={<ProductosForm />} />
              <Route path="ofertas" element={<OfertasList />} />
              <Route path="ofertas/new" element={<OfertasForm />} />
              <Route path="ofertas/edit/:id" element={<OfertasForm />} />
              <Route path="cupones" element={<CuponesList />} />
              <Route path="cupones/new" element={<CuponesForm />} />
              <Route path="cupones/edit/:id" element={<CuponesForm />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="profile/edit" element={<EditProfileForm />} />
            </Route>
          </Routes>
        </div>
      </div>

      {/* Pasamos setIsOnline al componente ConnectionStatus */}
      <ConnectionStatus setIsOnline={setIsOnline} />

      {/* Mostrar el banner de instalación si está disponible */}
      {deferredPrompt && showInstallBanner()}
    </Router>
  );
}

export default App;
