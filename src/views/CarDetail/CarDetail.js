import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos del carrusel
import './CarDetail.css';

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`https://evocars.vercel.app/api/autos/detailed/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const getCarImage = (foto) => {
    // Comprueba si la foto es una URL Base64 o una ruta en la carpeta pública
    if (foto.startsWith('data:image')) {
      return foto; // Retorna la imagen en Base64
    }
    // Para fotos en la carpeta pública, asume que la ruta es relativa a la raíz
    return `${process.env.PUBLIC_URL}/${foto}`;
  };

  if (!car) {
    return <p>Cargando detalles del carro...</p>;
  }

  return (
    <section className="car-detail-container">
      <div className="car-detail-content">
        {/* Carrusel de fotos (principal y adicionales) */}
        <div className="car-detail-image-wrapper">
          <Carousel showThumbs={false} infiniteLoop={true} useKeyboardArrows>
            {/* Mostrar la foto principal primero */}
            <div className="car-detail-carousel-slide">
              <img src={getCarImage(car.foto_principal)} alt={car.modelo} className="car-detail-image" />
            </div>
            {/* Mostrar fotos adicionales si existen */}
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
          <button className="car-detail-buy-button">Rentar</button>
        </div>
      </div>

      {/* Información adicional */}
      <section className="car-detail-additional-info">
        <div className="car-detail-description">
          <h2 className="car-detail-section-title">Descripción</h2>
          <p>{car.descripcion}</p> {/* Se agregó la descripción aquí */}
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
    </section>
  );
}

export default CarDetail;
