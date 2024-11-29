import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import RentalCalendar from '../rental/RentalCalendar';
import PriceCalculator from '../rental/PriceCalculator';
import PaymentForm from '../rental/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './CarDetail.css';

// Inicializar Stripe con tu clave pública
const stripePromise = loadStripe('pk_test_51Mrb28HdLgDOa2lxpXWf0Mri9xB64urmouApODc2mGZOKhbKedBVnFbh7ikN19IBv4FMX8KBJefcDSt6Bgk9RI2W00jtEE7lta');

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [priceDetails, setPriceDetails] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {

        const response = await axios.get(`https://evocars-cristian-ps-projects.vercel.app/api/autos/detailed/${id}`);


        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const getCarImage = (foto) => {
    if (foto.startsWith('data:image')) {
      return foto; 
    }
    return `${process.env.PUBLIC_URL}/${foto}`;
  };

  const handleDatesSelected = (startDate, endDate) => {
    setSelectedDates({ start: startDate, end: endDate });
    setShowPaymentForm(false);
  };

  const handlePriceCalculated = (details) => {
    setPriceDetails(details);
    setShowPaymentForm(true);
  };

  const handlePaymentCompleted = async (paymentResult) => {
    const tokenWeb = localStorage.getItem('token');
    try {

      const response = await axios.post('https://evocars-cristian-ps-projects.vercel.app/api/rentals/process-payment', {

        autoId: id,
        startDate: selectedDates.start,
        endDate: selectedDates.end,
        paymentMethod: paymentResult.payment_method,
        paymentToken: paymentResult.id,
        priceDetails
      },
      {
          headers: {
              Authorization: `Bearer ${tokenWeb}`,
          },
      });

      alert('¡Reserva completada con éxito!');
      navigate(`/rental-confirmation/${response.data.rental_id}`);
    } catch (error) {
      console.error('Error processing rental:', error);
      alert('Error al procesar la reserva');
    }
  };

  if (!car) {
    return <p>Cargando detalles del carro...</p>;
  }

  return (
    <section className="car-detail-container">
      <div className="car-detail-content">
        <div className="car-detail-image-wrapper">
          <Carousel showThumbs={false} infiniteLoop={true} useKeyboardArrows>
            <div className="car-detail-carousel-slide">
              <img src={getCarImage(car.foto_principal)} alt={car.modelo} className="car-detail-image" />
            </div>
            {car.fotos_adicionales && car.fotos_adicionales.map((url, index) => (
              <div key={index} className="car-detail-carousel-slide">
                <img src={getCarImage(url)} alt={`Foto adicional ${index + 1}`} className="car-detail-image" />
              </div>
            ))}
          </Carousel>
        </div>
        
        <div className="car-detail-info">
          <h1 className="car-detail-title">{car.modelo}</h1>
          <p className="car-detail-price">Precio al día: ${Math.round(car.precio_diario).toLocaleString()}</p>
          {car.precio_con_oferta !== car.precio_diario && (
            <p className="car-detail-discount">Precio con oferta: ${Math.round(car.precio_con_oferta).toLocaleString()} MXN</p>
          )}
          <p><strong>Propietario:</strong> {car.nombre_usuario}</p>
        </div>
      </div>

      <section className="car-detail-additional-info">
        <div className="car-detail-description">
          <h2 className="car-detail-section-title">Descripción</h2>
          <p>{car.descripcion}</p>
        </div>

        <div className="car-detail-specifications">
          <h2 className="car-detail-section-title">Especificaciones Técnicas</h2>
          <ul className="car-detail-ul">
            <li><strong>Cilindros:</strong> {car.cilindros}</li>
            <li><strong>Potencia:</strong> {car.potencia} HP</li>
            <li><strong>Color:</strong> {car.color}</li>
          </ul>
        </div>
      </section>

      <section className="rental-section">
        <div className="rental-container">
          <RentalCalendar
            autoId={id}
            onDatesSelected={handleDatesSelected}
          />
          
          {selectedDates.start && selectedDates.end && (
            <PriceCalculator
              autoId={id}
              startDate={selectedDates.start}
              endDate={selectedDates.end}
              onPriceCalculated={handlePriceCalculated}
            />
          )}
          
          {showPaymentForm && priceDetails && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                autoId={id}
                startDate={selectedDates.start}
                endDate={selectedDates.end}
                priceDetails={priceDetails}
                onPaymentCompleted={handlePaymentCompleted}
              />
            </Elements>
          )}
        </div>
      </section>
    </section>
  );
}

export default CarDetail;
