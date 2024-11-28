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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Solicitar permiso para notificaciones push
    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <div>
        {/* Mostrar la barra de navegaciÃ³n solo si no estamos en las rutas de login o registro */}
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
    </Router>
  );
}

// Funciones para notificaciones push
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permiso concedido para notificaciones');
      subscribeUserToPush();
    } else {
      console.log('Permiso denegado para notificaciones');
    }
  } catch (error) {
    console.error('Error al solicitar permiso para notificaciones:', error);
  }
};

const subscribeUserToPush = async () => {
  const swRegistration = await navigator.serviceWorker.ready;

  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
  });

  console.log('Subscription:', subscription);
  await sendSubscriptionToBackend(subscription);
};

const sendSubscriptionToBackend = async (subscription) => {
  const response = await fetch('https://evocars-cristian-ps-projects.vercel.app/api/push/send-welcome', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: subscription,
      userName: 'UsuarioEjemplo',
    }),
  });

  if (response.ok) {
    console.log('Suscripción enviada correctamente');
  } else {
    console.error('Error enviando la suscripción');
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default App;
