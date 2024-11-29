import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import NotificationService from '../../services/NotificationService';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    if (token && storedUserRole) {
      setIsAuthenticated(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://evocars-cristian-ps-projects.vercel.app/api/auth/login', {
        email: email,
        contrasena: password,
      });

      // Guarda el token y la información del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      localStorage.setItem('userRole', response.data.userInfo.id_rol);
      
      // Configurar notificaciones push después del login exitoso
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const permissionGranted = await NotificationService.requestPermission();
          
          if (permissionGranted) {
            await NotificationService.registerServiceWorker();
            const subscription = await NotificationService.subscribeToPush();
            await NotificationService.savePushSubscription(
              subscription, 
              response.data.userInfo.id_usuario
            );
          }
        } catch (notificationError) {
          console.error('Error al configurar notificaciones:', notificationError);
          // Continuamos con el login aunque fallen las notificaciones
        }
      }

      setIsAuthenticated(true);
      setUserRole(response.data.userInfo.id_rol);

      // Redirigir según el rol del usuario
      if (response.data.userInfo.id_rol === 2) {
        window.location.href = '/renter';
      } else if (response.data.userInfo.id_rol === 3) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Contraseña incorrecta. Por favor, inténtelo de nuevo.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
      }
      console.error('Error al iniciar sesión:', error);
    }
  };

  if (isAuthenticated) {
    if (userRole === '2') {
      return <Navigate to="/renter" />;
    } else if (userRole === '3') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="login-form">
        <div className="form-content">
          <h2>LOGIN</h2>
          <p>Bienvenido a EVOCARS</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <p className="text-center">
            No tienes cuenta? <a href="/register" className="link">Registrate</a>
          </p>
          <p className="text-center">
            Quieres rentar? <a href="/renter-register" className="link">Registrate</a>
          </p>
        </div>
        <div className="logo">
          <img src="logo.png" alt="EVOCARS Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;