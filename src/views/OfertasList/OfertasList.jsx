import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfertasList.css';
import { useNavigate } from 'react-router-dom';

const OfertasList = () => {
  const [ofertas, setOfertas] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const id_rol = userInfo?.id_rol; // Uso de optional chaining para mayor seguridad
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        let response;
        if (id_rol === 2) {
          response = await axios.get(`https://evocars-cristian-ps-projects.vercel.app/api/autos/ofertavend/${userInfo.id_usuario}`);
        } else if (id_rol === 3) {
          response = await axios.get('https://evocars-cristian-ps-projects.vercel.app/api/ofertas');
        }
        setOfertas(response.data || []); // Establecer un array vacío por defecto si no hay datos
      } catch (error) {
        console.error('Error al obtener ofertas', error);
      }
    };

    fetchOfertas();
  }, [id_rol, userInfo.id_usuario]);

  const eliminarOferta = async (id) => {
    try {
      await axios.delete(`https://evocars-cristian-ps-projects.vercel.app/api/ofertas/${id}`, {
        data: { id_oferta: id }
      });
      setOfertas(prevOfertas => prevOfertas.filter(oferta => oferta.id_oferta !== id)); // Uso de función de actualización de estado
    } catch (error) {
      console.error('Error al eliminar la oferta', error);
    }
  };

  const verificarVigencia = (fechaFin) => new Date() <= new Date(fechaFin);

  const agregarOferta = (id_auto) => {
    // Almacena el id_auto en localStorage
    if (id_auto) {
      localStorage.setItem('id_auto', id_auto);
    }
    // Redirigir a la página de agregar oferta dependiendo del rol
    const basePath = id_rol === 2 ? '/renter/ofertas/new' : '/admin/ofertas/new';
    navigate(basePath);
  };

  const editarOferta = (id_oferta) => {
    const basePath = id_rol === 2 ? '/renter/ofertas/edit/' : '/admin/ofertas/edit/';
    navigate(`${basePath}${id_oferta}`);
  };

  return (
    <div className="ofertas-list-container-unique">
      <h2 className="ofertas-list-title-unique">Lista de Ofertas</h2>
      {id_rol === 2 && (
        <div className="ofertas-list-button-container-unique">
          <button onClick={() => agregarOferta()} className="agregar-btn-unique">
            Agregar Oferta
          </button>
        </div>
      )}
      <table className="ofertas-table-unique">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Tipo de Descuento</th>
            <th>Valor Descuento</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Precio Diario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.length > 0 ? (
            ofertas.map(oferta => (
              <tr key={oferta.id_oferta}>
                <td>{oferta.descripcion || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td>{oferta.tipo_descuento || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td>{oferta.valor_descuento || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td>{oferta.fecha_inicio ? new Date(oferta.fecha_inicio).toLocaleDateString() : <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td style={{ color: verificarVigencia(oferta.fecha_fin) ? 'green' : 'red' }}>
                  {oferta.fecha_fin ? new Date(oferta.fecha_fin).toLocaleDateString() : 'Sin oferta'}
                </td>
                <td>{oferta.modelo || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td>{oferta.marca || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td>{oferta.precio_diario || <span style={{ color: 'gray' }}>Sin oferta</span>}</td>
                <td className="ofertas-list-action-buttons-unique">
                  {oferta.descripcion ? (
                    <>
                      <button onClick={() => eliminarOferta(oferta.id_oferta)} className="eliminar-btn-unique">
                        Eliminar
                      </button>
                      <button
                        onClick={() => editarOferta(oferta.id_oferta)} // Llama a la nueva función de editar
                        className={verificarVigencia(oferta.fecha_fin) ? 'editar-btn-unique' : 'editar-vencido-btn-unique'}
                      >
                        Editar
                      </button>
                    </>
                  ) : (
                    id_rol === 2 && (
                      <button onClick={() => agregarOferta(oferta.id_auto)} className="agregar-btn-unique">
                        Agregar Oferta
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No se encontraron ofertas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfertasList;
