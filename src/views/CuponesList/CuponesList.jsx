import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import './CuponesList.css';

const CuponesList = () => {
  const [cupones, setCupones] = useState([]);
  const [userRole, setUserRole] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
      const role = userInfo.id_rol;
      const id = userInfo.id_usuario;

      setUserRole(role);
      setUserId(id);

      const fetchCupones = async () => {
        try {
          let response;
          if (role === 2) {
            response = await axios.get(`http://localhost:8080/api/cupones/usuario/${id}`);
          } else if (role === 3) {
            response = await axios.get('http://localhost:8080/api/cupones');
          }

          if (response && response.data) {
            setCupones(response.data);
          } else {
            setCupones([]);
          }
        } catch (error) {
          console.error('Error fetching cupones:', error);
          setCupones([]);
        }
      };

      fetchCupones();
    } else {
      console.error('No se encontró userinfo en localStorage');
    }
  }, []);

  const deleteCupon = (id_cupon) => {
    axios.delete(`http://localhost:8080/api/cupones/${id_cupon}`)
      .then(() => setCupones(cupones.filter(cupon => cupon.id_cupon !== id_cupon)))
      .catch(error => console.error('Error deleting cupon:', error));
  };

  const handleAddCupon = () => {
    const newPath = userRole === 2 ? '/renter/cupones/new' : '/admin/cupones/new';
    navigate(newPath); // Redirigir a la página de agregar cupón
  };

  const handleEditCupon = (id_cupon) => {
    const editPath = userRole === 2 ? `/renter/cupones/edit/${id_cupon}` : `/admin/cupones/edit/${id_cupon}`;
    navigate(editPath);
  };

  return (
    <div className="cupones-list-container">
      <h1 className="cupones-list-title">Lista de Cupones</h1>
      {userRole === 2 && (
        <div className="cupones-list-button-container">
          <button onClick={handleAddCupon} className="cupones-list-button">Agregar Nuevo Cupón</button>
        </div>
      )}
      <table className="cupones-list-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Tipo de Descuento</th>
            <th>Valor de Descuento</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Uso Máximo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cupones.length > 0 ? (
            cupones.map(cupon => (
              <tr key={cupon.id_cupon}>
                <td>{cupon.codigo}</td>
                <td>{cupon.descripcion}</td>
                <td>{cupon.tipo_descuento}</td>
                <td>${parseFloat(cupon.valor_descuento).toLocaleString()}</td>
                <td>{new Date(cupon.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(cupon.fecha_fin).toLocaleDateString()}</td>
                <td>{cupon.uso_maximo}</td>
                <td className="cupones-list-action-buttons">
                  {userRole === 2 || userRole === 3 ? (
                    <>
                      <button onClick={() => handleEditCupon(cupon.id_cupon)} className="cupones-list-button">Editar</button>
                      {userRole === 2 && (
                        <button onClick={() => deleteCupon(cupon.id_cupon)} className="cupones-list-button cupones-list-delete-button">
                          Eliminar
                        </button>
                      )}
                    </>
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No se encontraron cupones.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CuponesList;
