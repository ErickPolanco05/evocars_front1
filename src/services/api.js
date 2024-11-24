// src/api/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://evocars.vercel.app/api', // Reemplaza con la URL de tu API backend
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
