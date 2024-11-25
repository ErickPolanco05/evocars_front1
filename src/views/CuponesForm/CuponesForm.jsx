import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CuponesForm.css';

const CuponesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoDescuento, setTipoDescuento] = useState('');
  const [valorDescuento, setValorDescuento] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [usoMaximo, setUsoMaximo] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`https://evocars-cristian-ps-projects.vercel.app/api/cupones/${id}`)
        .then(response => {
          const couponData = response.data;
          setCodigo(couponData.codigo);
          setDescripcion(couponData.descripcion);
          setTipoDescuento(couponData.tipo_descuento);
          setValorDescuento(couponData.valor_descuento);
          // Asegúrate de que las fechas están en formato YYYY-MM-DD
          setFechaInicio(formatDate(couponData.fecha_inicio));
          setFechaFin(formatDate(couponData.fecha_fin));
          setUsoMaximo(couponData.uso_maximo);
        })
        .catch(error => {
          console.error('Error fetching coupon data:', error);
        });
    }
  }, [id]);

  const formatDate = (dateString) => {
    // Convertir la fecha en el formato adecuado (YYYY-MM-DD)
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses en base 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const id_usuario = userInfo ? userInfo.id_usuario : null;
    const id_rol = userInfo ? userInfo.id_rol : null;

    const couponData = {
      id_usuario,
      codigo,
      descripcion,
      tipo_descuento: tipoDescuento,
      valor_descuento: valorDescuento,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      uso_maximo: usoMaximo,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/cupones/${id}`, couponData);
      } else {
        await axios.post('http://localhost:8080/api/cupones', couponData);
      }

      if (id_rol === 3) {
        navigate('/admin/cupones');
      } else if (id_rol === 2) {
        navigate('/renter/cupones');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  return (
    <div className="styled-form-container">
      <form onSubmit={handleSubmit} className="styled-form">
        <h1>{id ? 'Editar Cupón' : 'Agregar Nuevo Cupón'}</h1>

        <div className="styled-form-group">
          <label>Código</label>
          <input 
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>

        <div className="styled-form-group">
          <label>Descripción</label>
          <input 
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="styled-form-group">
          <label>Tipo de Descuento</label>
          <select value={tipoDescuento} onChange={(e) => setTipoDescuento(e.target.value)} required>
            <option value="">Selecciona un tipo</option>
            <option value="porcentaje">Porcentaje</option>
            <option value="fijo">Fijo</option>
          </select>
        </div>

        <div className="styled-form-group">
          <label>Valor de Descuento</label>
          <input 
            type="number"
            value={valorDescuento}
            onChange={(e) => setValorDescuento(e.target.value)}
            required
          />
        </div>

        <div className="styled-form-group">
          <label>Fecha de Inicio</label>
          <input 
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>

        <div className="styled-form-group">
          <label>Fecha de Fin</label>
          <input 
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>

        <div className="styled-form-group">
          <label>Uso Máximo</label>
          <input 
            type="number"
            value={usoMaximo}
            onChange={(e) => setUsoMaximo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="styled-form-button">
          {id ? 'Guardar Cambios' : 'Agregar Cupón'}
        </button>
      </form>
    </div>
  );
};

export default CuponesForm;
