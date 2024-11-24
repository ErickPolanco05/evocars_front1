import React from 'react';
import './Home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos del carrusel
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faUser } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="home-page">
      
      <main className="main">
        <section className="hero">
          <div className="hero-text">
            <h1>Bienvenido a Evo<span className="highlight">Cars</span></h1>
            <p>El mejor servicio de renta de autos en Mérida. 
            <br></br>Contamos con oficinas cerca de casi todos los sitios de interés
            <br></br>en Yucatán, ofreciendo autos de calidad y tarifas realmente bajas, 
            <br></br>las mejores ofertas y promociones las encuentras solo con nosotros.
            </p>
          </div>

          {/* Carousel de imágenes en la sección Hero */}
          <div className="hero-carousel">
            <Carousel
              showThumbs={false}
              autoPlay
              infiniteLoop
              showStatus={false}
              stopOnHover
              interval={5000}
              showArrows={false}
            >
              <div>
                <img src="fondo1.jpg" alt="Car 1" />
              </div>
              <div>
                <img src="fondo2.jpg" alt="Car 2" />
              </div>
              <div>
                <img src="fondo3.jpg" alt="Car 3" />
              </div>
              <div>
                <img src="fondo4.jpg" alt="Car 4" />
              </div>
            </Carousel>
          </div>
        </section>
        
        <section className="about">
          <div className="about-content">
            <div className="about-text">
              <h2>Sobre <span className="highlight1">Nosotros</span></h2>
              <p>Somos un equipo especializado en ofrecer servicios confiables de alquiler de autos, comprometidos en brindarte una experiencia sin complicaciones y adaptada a tus necesidades. Nos enfocamos en ofrecer vehículos de alta calidad, con mantenimiento regular, y un servicio al cliente excepcional para garantizar tu tranquilidad en cada viaje. Ya sea que necesites un auto para un viaje de negocios, vacaciones o cualquier ocasión especial, estamos aquí para ofrecerte opciones flexibles y a precios competitivos, asegurando siempre la máxima transparencia y confianza en cada paso del proceso.</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2024 EvoCars. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
