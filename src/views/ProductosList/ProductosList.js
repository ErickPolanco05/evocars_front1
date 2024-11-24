import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductosList.css';

const ProductosList = () => {
  const [cars, setCars] = useState([]);
  const [userRole, setUserRole] = useState(0);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]); // Agregar estado para categorías

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
      const role = userInfo.id_rol; 
      const id = userInfo.id_usuario; 

      setUserRole(role);
      setUserId(id);

      const fetchCars = async () => {
        try {
          let response;
          if (role === 2) {
            response = await axios.get(`http://localhost:8080/api/autos/usuario/${id}`);
          } else if (role === 3) {
            response = await axios.get('http://localhost:8080/api/autos');
          }

          if (response && response.data) {
            // Asumir que la respuesta incluye id_categoria
            setCars(response.data);
          } else {
            setCars([]);
          }
        } catch (error) {
          console.error('Error fetching cars:', error);
          setCars([]);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/categorias');
          setCategories(response.data); // Almacenar las categorías
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories(); // Llamar a la función para obtener categorías
      fetchCars();
    } else {
      console.error('No se encontró userinfo en localStorage');
    }
  }, []);

  const deleteCar = (id_auto) => {
    axios.delete(`http://localhost:8080/api/autos/${id_auto}`)
      .then(() => setCars(cars.filter(car => car.id_auto !== id_auto)))
      .catch(error => console.error('Error deleting car:', error));
  };

  const getCarImage = (foto_principal) => {
    if (foto_principal.startsWith('data:image')) {
      return foto_principal; 
    }
    return `${process.env.PUBLIC_URL}/${foto_principal}`;
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (id_categoria) => {
    const category = categories.find(cat => cat.id_categoria === id_categoria);
    return category ? category.nombre_categoria : 'No definida';
  };

  return (
    <div className="productos-list-container-unique">
      <h1 className="productos-list-title-unique">Lista de Carros</h1>
      {userRole === 2 && (
        <div className="productos-list-button-container-unique">
          <Link to="/renter/productos/new" className="productos-list-button-unique">Agregar Nuevo Carro</Link>
        </div>
      )}
      {userRole === 3 && (
        <div className="productos-list-button-container-unique">
          <Link to="/admin/productos/new" className="productos-list-button-unique">Agregar Nuevo Carro</Link>
        </div>
      )}
      <table className="productos-list-table-unique">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Cilindros</th>
            <th>Potencia</th>
            <th>Color</th>
            <th>Precio</th>
            <th>Motor</th>
            <th>Foto</th>
            {userRole === 3 && <th>Publicado por</th>} {/* Solo mostrar si es admin */}
            <th>Marca</th> {/* Nueva columna de Marca */}
            <th>Categoría</th> {/* Nueva columna de Categoría */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map(car => (
              <tr key={car.id_auto}>
                <td>{car.modelo}</td>
                <td>{car.cilindros}</td>
                <td>{car.potencia}</td>
                <td>{car.color}</td>
                <td>${parseFloat(car.precio_diario).toLocaleString()} MXN</td>
                <td>{car.tipo_motor}</td>
                <td>
                  {car.foto_principal && (
                    <img src={getCarImage(car.foto_principal)} alt={car.modelo} className="productos-list-car-image-unique" />
                  )}
                </td>
                {userRole === 3 && <td>{car.nombre_usuario}</td>} {/* Solo mostrar si es admin */}
                <td>{car.marca}</td> {/* Mostrar Marca */}
                <td>{getCategoryName(car.id_categoria)}</td> {/* Mostrar Categoría usando la función */}
                <td className="productos-list-action-buttons-unique">
                  {userRole === 2 || userRole === 3 ? (
                    <>
                      <Link to={userRole === 2 ? `/renter/productos/edit/${car.id_auto}` : `/admin/productos/edit/${car.id_auto}`} className="productos-list-button-unique">
                        Editar
                      </Link>
                      {userRole === 2 && (
                        <button onClick={() => deleteCar(car.id_auto)} className="productos-list-button-unique productos-list-delete-button-unique">
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
              <td colSpan={userRole === 3 ? "10" : "9"} className="text-center">No se encontraron carros.</td> {/* Ajuste en el colspan */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosList;
