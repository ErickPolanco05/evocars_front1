import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './RenterRegister.css';

function RenterRegister() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Hombre'); // Valor por defecto
  const [birthdate, setBirthdate] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/usuarios', {
        nombre: fullName,
        email: email,
        contrasena: password,
        fecha_nac: birthdate,
        genero: gender,
        id_rol: 2, // Por defecto, todos los rentadores tendrán id_rol: 2
        foto: "foto_perfil.jpg" // Valor por defecto para la foto
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      window.location.href = '/renter';
    } catch (error) {
      console.error('Error al registrar rentador:', error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="renter-register-container">
      <div className="renter-register-form">
        <div className="form-content">
          <h2>Registrar Rentador</h2>
          <p>Bienvenido a EVOCARS</p>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                type="text"
                id="fullName"
                placeholder="Ingresa tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu email"
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
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Género</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="birthdate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Registrar</button>
          </form>
          <p className="text-center">
            ¿Ya tienes una cuenta? 
            <a href="/login" className="link">Iniciar sesión</a>
          </p>
        </div>
        <div className="logo">
          <img src="logo.png" alt="EVOCARS Logo" />
        </div>
      </div>
    </div>
  );
}

export default RenterRegister;
