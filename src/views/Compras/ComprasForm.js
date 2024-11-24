import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ComprasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState({
    id_usuarios: '',
    id_carro: '',
    monto: '',
    pago: '',
    fecha_compra: '',
    estado: '',
  });

  useEffect(() => {
    if (id) {
      const fetchCompra = async () => {
        try {
          const response = await axios.get(`https://evocars.vercel.app/api/compra/${id}`);
          setCompra(response.data);
        } catch (error) {
          console.error('Error fetching compra: ', error);
        }
      };

      fetchCompra();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompra({ ...compra, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`https://evocars.vercel.app/api/compra/${id}`, compra ,{
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('https://evocars.vercel.app/api/compra', compra, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      navigate('/compras');
    } catch (error) {
      console.error('Error saving compra: ', error);
    }
  };

  return (
    <div className="compra-form">
      <h2>{id ? 'Editar Compra' : 'Nueva Compra'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID Usuario</label>
          <input
            type="text"
            name="id_usuarios"
            value={compra.id_usuarios}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>ID Carro</label>
          <input
            type="text"
            name="id_carro"
            value={compra.id_carro}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Monto</label>
          <input
            type="text"
            name="monto"
            value={compra.monto}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Pago</label>
          <input
            type="text"
            name="pago"
            value={compra.pago}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Fecha Compra</label>
          <input
            type="text"
            name="fecha_compra"
            value={compra.fecha_compra}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <input
            type="text"
            name="estado"
            value={compra.estado}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
};

export default ComprasForm;
