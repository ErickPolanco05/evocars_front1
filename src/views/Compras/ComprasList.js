import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ComprasList.css'; // Import the CSS file

const ComprasList = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/compra');
        setCompras(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const deleteCompra = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/compra/${id}`);
      setCompras(compras.filter((compra) => compra.id_compra !== id));
    } catch (error) {
      console.error('Error deleting compra: ', error);
    }
  };

  return (
    <div className="compras-list">
      <h2>Lista de Compras</h2>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Carro</th>
            <th>Monto</th>
            <th>Pago</th>
            <th>Fecha Compra</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id_compra}>
              <td>{compra.id_compra}</td>
              <td>{compra.usuario}</td>
              <td>{compra.modelo}</td>
              <td>{compra.precio}</td>
              <td>{compra.pago}</td>
              <td>{compra.fecha_compra}</td>
              <td>{compra.estado}</td>
              <td>
                <Link to={`/compras/edit/${compra.id_compra}`} className="btn btn-warning">Editar</Link>
                <button onClick={() => deleteCompra(compra.id_compra)} className="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasList;