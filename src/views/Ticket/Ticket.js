import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "./Ticket.css";

const Receipt = () => {
  const location = useLocation();
  const { id_compra } = location.state || {};

  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await axios.get(`https://evocars-cristian-ps-projects.vercel.app/api/compra/${id_compra}`);
        setPurchase(response.data);
      } catch (error) {
        console.error('Error fetching purchase:', error);
      }
    };

    if (id_compra) {
      fetchPurchase();
    }
  }, [id_compra]);

  if (!id_compra) {
    return <div className="receipt-wrapper">No purchase ID available</div>;
  }

  if (!purchase) {
    return <div className="receipt-wrapper">Loading...</div>;
  }

  // Validar si purchase.pago es un número antes de usar toFixed
  const formattedPago = typeof purchase.pago === 'number' ? purchase.pago.toFixed(2) : '';

  return (
    <div className="receipt-wrapper">
      <div className="receipt-container">
        <div className="receipt-header">
          <div className="logo">
            <img src="logo.png" alt="Logo" className="company-logo" />
          </div>
          <div className="company-info">
            <h2>EVOCARS</h2>
            <p>Mérida, Yucatán, México</p>
            <p>CP. 97000</p>
          </div>
        </div>
        <div className="receipt-body">
          <div className="receipt-title">
            <h3>Ticket</h3>
          </div>
          <div className="receipt-date">
            <p>{purchase.fecha_compra}</p>
          </div>
          <div className="receipt-items">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{purchase.modelo}</td>
                  <td>$ {purchase.precio} MXN</td> {/* Utilizar la variable formateada */}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="receipt-total">
            <p>Status:</p>
            <p>{purchase.estado}</p>
          </div>
          <div className="receipt-details">
            <table>
              <thead>
                <tr>
              
                  <th></th>
                  <th>Client</th>
                  <th>Payment method</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  <td>{formattedPago}</td> {/* Utilizar la variable formateada */}
                  <td>{purchase.usuario}</td>
                  <td>{purchase.pago}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="receipt-footer">
            <p>Congratulations on your new car!!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
