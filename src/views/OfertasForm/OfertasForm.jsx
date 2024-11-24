import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './OfertasForm.css';

const OfertasForm = () => {
  const { id } = useParams(); // Obtenemos el id de la oferta desde la URL si existe
  const navigate = useNavigate(); // Hook para navegar
  const [isEditMode, setIsEditMode] = useState(false); // Para saber si estamos en modo edición
  const [ofertaData, setOfertaData] = useState({
    id_auto: '', // Este campo se completará desde localStorage
    descripcion: '',
    tipo_descuento: '',
    valor_descuento: '',
    fecha_inicio: '',
    fecha_fin: '',
    modelo: '' // Agregamos un campo para almacenar el modelo del auto
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          // Obtener oferta para editar
          const response = await axios.get(`http://localhost:8080/api/ofertas/${id}`);
          const oferta = response.data;
          oferta.fecha_inicio = oferta.fecha_inicio ? new Date(oferta.fecha_inicio).toISOString().split('T')[0] : '';
          oferta.fecha_fin = oferta.fecha_fin ? new Date(oferta.fecha_fin).toISOString().split('T')[0] : '';

          // Obtener detalles del auto
          const autoResponse = await axios.get(`http://localhost:8080/api/autos/detailed/${oferta.id_auto}`);
          oferta.modelo = autoResponse.data.modelo; // Asumimos que la respuesta tiene el modelo

          setOfertaData({ ...oferta });
        } catch (error) {
          console.error('Error al obtener la oferta o el auto', error);
        }
      }
    };

    // Solo si estamos en modo agregar, obtenemos el modelo del auto
    const fetchAutoModel = async () => {
      if (!id) {
        const id_auto = localStorage.getItem('id_auto'); // Obtener el id_auto del localStorage
        if (id_auto) {
          try {
            const autoResponse = await axios.get(`http://localhost:8080/api/autos/detailed/${id_auto}`);
            setOfertaData(prev => ({
              ...prev,
              id_auto: id_auto,
              modelo: autoResponse.data.modelo // Asumimos que la respuesta tiene el modelo
            }));
          } catch (error) {
            console.error('Error al obtener el modelo del auto', error);
          }
        }
      }
    };

    fetchData();
    fetchAutoModel();
  }, [id]);

  const handleChange = (e) => {
    setOfertaData({
      ...ofertaData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Formatear los datos antes de enviar
      const dataToSend = {
        id_auto: Number(ofertaData.id_auto), // Asegúrate de enviar id_auto como bigint
        descripcion: ofertaData.descripcion,
        tipo_descuento: ofertaData.tipo_descuento,
        valor_descuento: Number(ofertaData.valor_descuento), // Asegúrate de que el valor sea un número
        fecha_inicio: ofertaData.fecha_inicio,
        fecha_fin: ofertaData.fecha_fin
      };

      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/ofertas/${id}`, dataToSend);
      } else {
        await axios.post('http://localhost:8080/api/ofertas', dataToSend);
      }

      // Eliminar el id_auto del localStorage al terminar
      localStorage.removeItem('id_auto');

      // Redirigir al panel donde estaba el usuario
      navigate(-1); // Navega a la página anterior en el historial
    } catch (error) {
      console.error('Error al guardar la oferta', error);
    }
  };

  return (
    <div className="ofertas-form-container-unique">
      <h2>{isEditMode ? 'Editar Oferta' : 'Crear Nueva Oferta'}</h2>
      <form onSubmit={handleSubmit} className="ofertas-form-unique">
        <div className="form-group-unique">
          <label>Modelo del Auto:</label>
          <input type="text" name="modelo" value={ofertaData.modelo} onChange={handleChange} readOnly />
        </div>
        <div className="form-group-unique">
          <label>Descripción:</label>
          <input type="text" name="descripcion" value={ofertaData.descripcion} onChange={handleChange} required />
        </div>
        <div className="form-group-unique">
          <label>Tipo de Descuento:</label>
          <input type="text" name="tipo_descuento" value={ofertaData.tipo_descuento} onChange={handleChange} required />
        </div>
        <div className="form-group-unique">
          <label>Valor Descuento:</label>
          <input type="number" name="valor_descuento" value={ofertaData.valor_descuento} onChange={handleChange} required />
        </div>
        <div className="form-group-unique">
          <label>Fecha Inicio:</label>
          <input type="date" name="fecha_inicio" value={ofertaData.fecha_inicio} onChange={handleChange} required />
        </div>
        <div className="form-group-unique">
          <label>Fecha Fin:</label>
          <input type="date" name="fecha_fin" value={ofertaData.fecha_fin} onChange={handleChange} required />
        </div>
        <button type="submit" className="crear-btn-unique">
          {isEditMode ? 'Actualizar Oferta' : 'Crear Oferta'}
        </button>
      </form>
    </div>
  );
};

export default OfertasForm;
