// src/api/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://tu-backend-api-url.com/api', // Reemplaza con la URL de tu API backend
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
