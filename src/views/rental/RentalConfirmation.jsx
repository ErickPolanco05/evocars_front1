import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RentalConfirmation.css';

const RentalConfirmation = () => {
  const { rentalId } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/rentals/${rentalId}`);
        setRental(response.data);
      } catch (error) {
        console.error('Error fetching rental details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  if (loading) {
    return (
      <div className="rental-confirmation loading">
        <div className="loader"></div>
        <p>Cargando detalles de la reserva...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="rental-confirmation error">
        <h2>Error al cargar la reserva</h2>
        <p>No se pudo encontrar la información de la reserva.</p>
        <Link to="/" className="home-button">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="rental-confirmation">
      <div className="confirmation-header">
        <img src="/check-circle.svg" alt="Success" className="success-icon" />
        <h2>¡Reserva Confirmada!</h2>
      </div>

      <div className="confirmation-details">
        <div className="detail-section">
          <h3>Detalles de la Reserva</h3>
          <ul>
            <li>
              <span>Número de Reserva:</span>
              <strong>{rental.id_reserva}</strong>
            </li>
            <li>
              <span>Fecha de Inicio:</span>
              <strong>{new Date(rental.fecha_inicio).toLocaleDateString()}</strong>
            </li>
            <li>
              <span>Fecha de Fin:</span>
              <strong>{new Date(rental.fecha_fin).toLocaleDateString()}</strong>
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h3>Detalles del Vehículo</h3>
          <ul>
            <li>
              <span>Modelo:</span>
              <strong>{rental.modelo}</strong>
            </li>
            <li>
              <span>Marca:</span>
              <strong>{rental.marca}</strong>
            </li>
            <li>
              <span>Sucursal de Retiro:</span>
              <strong>{rental.nombre_sucursal}</strong>
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h3>Detalles del Pago</h3>
          <ul>
            <li>
              <span>Precio Total:</span>
              <strong>${rental.precio_total}</strong>
            </li>
            {rental.cupon_descuento > 0 && (
              <li>
                <span>Descuento Aplicado:</span>
                <strong>${rental.cupon_descuento}</strong>
              </li>
            )}
            <li>
              <span>Método de Pago:</span>
              <strong>{rental.tipo_pago === 'stripe' ? 'Tarjeta' : 'PayPal'}</strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="confirmation-actions">
        <a 
          href={`/api/rentals/invoice/${rental.id_reserva}`} 
          className="download-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Descargar Factura
        </a>
        <Link to="/" className="home-button">
          Volver al inicio
        </Link>
      </div>

      <div className="confirmation-footer">
        <p>Se ha enviado un correo electrónico con los detalles de tu reserva.</p>
        <p>Para cualquier consulta, no dudes en contactarnos:</p>
        <p className="contact-info">
          <a href="tel:+1234567890">+123 456 7890</a> |
          <a href="mailto:support@evocars.com">support@evocars.com</a>
        </p>
      </div>
    </div>
  );
};

export default RentalConfirmation;
