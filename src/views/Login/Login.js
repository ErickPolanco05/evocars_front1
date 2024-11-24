import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/config'; 
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole'); // Obtén el rol almacenado
    if (token && storedUserRole) {
      setIsAuthenticated(true);
      setUserRole(storedUserRole); // Almacena el rol en el estado
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        contrasena: password,
      });

      // Guarda el token, la información del usuario y el rol en el localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      localStorage.setItem('userRole', response.data.userInfo.id_rol); // Guarda el rol del usuario
      setIsAuthenticated(true);
      setUserRole(response.data.userInfo.id_rol); // Actualiza el estado con el rol del usuario

      // Redirigir según el rol del usuario
      if (response.data.userInfo.id_rol === 2) {
        window.location.href = '/renter'; // Redirige a /renter si el rol es 2
      } else if (response.data.userInfo.id_rol === 3) {
        window.location.href = '/admin'; // Redirige a /admin si el rol es 3
      } else {
        window.location.href = '/'; // Redirige al home para otros roles
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
    // Si el usuario ya está autenticado, maneja la redirección aquí también
    if (userRole === '2') {
      return <Navigate to="/renter" />; // Redirigir al renter si es rol 2
    } else if (userRole === '3') {
      return <Navigate to="/admin" />; // Redirigir al panel de administradores si es rol 3
    }
    return <Navigate to="/" />; // Redirigir al home para otros roles
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
