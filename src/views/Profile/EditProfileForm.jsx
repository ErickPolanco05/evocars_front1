import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditarPerfil = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Suponiendo que tienes userInfo almacenado en localStorage
  const idUsuario = userInfo.id_usuarios; // Obtener el ID de usuario

  const [nombre, setNombre] = useState(userInfo.nombre);
  const [email, setEmail] = useState(userInfo.email);
  const [contrasena, setContrasena] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(userInfo.fecha_nac);
  const [genero, setGenero] = useState(userInfo.genero);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [imagenPerfilBase64, setImagenPerfilBase64] = useState(null); // Para almacenar la imagen en formato base64

  useEffect(() => {
    // Cargar datos del usuario al montar el componente, si es necesario
  }, []);

  const handleImagenPerfilChange = (e) => {
    const file = e.target.files[0];
    setImagenPerfil(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagenPerfilBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let userData = {
        nombre,
        email,
        contrasena: contrasena || undefined, // Solo enviar la contraseña si se ha cambiado
        fecha_nac: fechaNacimiento, // Ajustado para coincidir con el backend
        genero,
        foto: imagenPerfilBase64, // Enviar la imagen en formato base64
        id_rol: userInfo.id_rol // Incluir id_rol del userInfo
      };

      // Si no se cambió la imagen, no enviar la propiedad 'foto' para evitar problemas con el backend
      if (!imagenPerfilBase64) {
        userData = {
          ...userData,
          foto: undefined
        };
      }
      console.log('Perfil actualizado:');
      const response = await axios.put(`https://evocars.vercel.app/api/usuarios/${idUsuario}`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Perfil actualizado:', response.data);

      // Actualizar userInfo en localStorage con la respuesta
      localStorage.setItem('userInfo', JSON.stringify(response.data));

      window.location.href = '/profile';
      // Manejar la respuesta del servidor, como mostrar un mensaje de éxito al usuario

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      // Manejar errores, como mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="editar-perfil">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input type="password" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input type="date" id="fechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="genero">Género:</label>
          <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="imagenPerfil">Imagen de Perfil:</label>
          <input type="file" id="imagenPerfil" accept="image/*" onChange={handleImagenPerfilChange} />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPerfil;
