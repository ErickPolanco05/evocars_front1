import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UserForm.css';

const UserForm = () => {
  const [user, setUser] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    fecha_nac: '',
    genero: '',
    id_rol: '',
    foto: ''
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`https://evocars.vercel.app/api/usuarios/${id}`)
        .then(response => setUser(response.data))
        .catch(error => console.error('Error fetching user:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUser({ ...user, foto: e.target.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...user };

    try {
      if (id) {
        await axios.put(`https://evocars.vercel.app/api/usuarios/${id}`, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('https://evocars.vercel.app/api/usuarios', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Redirigir dependiendo del rol
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userRole = userInfo?.id_rol;

      if (userRole === 3) {
        navigate('/admin/usuarios');
      } else if (userRole === 2) {
        navigate('/admin/usuarios2');
      } else {
        navigate('/usuarios'); // Ruta predeterminada en caso de roles inesperados
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="user-form-container">
      <br />
      <br />
      <h2>{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" value={user.nombre} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </label>
        <label>
          Contraseña:
          <input type="password" name="contrasena" value={user.contrasena} onChange={handleChange} required />
        </label>
        <label>
          Fecha de Nacimiento:
          <input type="date" name="fecha_nac" value={user.fecha_nac} onChange={handleChange} required />
        </label>
        <label>
          Género:
          <select name="genero" value={user.genero} onChange={handleChange} required>
            <option value="">Seleccione</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label>
          Rol:
          <input type="number" name="id_rol" value={user.id_rol} onChange={handleChange} required />
        </label>
        <label>
          Foto:
          <input type="file" name="foto" onChange={handleFileChange} />
        </label>
        <button type="submit" className="submit-button">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
};

export default UserForm;
