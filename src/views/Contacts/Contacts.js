import React, { useState } from 'react';
import './Contacts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Contacts() {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    setShowModal(true); // Show the modal after form submission logic (simulated here)
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    window.location.reload(); // Reload the page
  };

  return (
    <div className="contacts-container">

      {/* Sección: Contáctanos */}
      <section className="contact-info">
        <div className="contact-details">
        <h2>Contáctanos</h2>
          <div><FontAwesomeIcon icon={faEnvelope} /> evocars@gmail.com</div>
          <div><FontAwesomeIcon icon={faPhone} /> +52 999 233 2345</div>
          
          <div className="social-media">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.678830616622!2d-89.65102568507558!3d20.98925658602133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56716fb7f1b6bb%3A0x8c8b9c4c9c8a9a5e!2sUniversidad%20Tecnol%C3%B3gica%20Metropolitana!5e0!3m2!1ses-419!2smx!4v1626198838420!5m2!1ses-419!2smx"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Mapa"
          ></iframe>
        </div>
      </section>

      

      {/* Sección: ¿Cómo podemos ayudarte? */}
      <section className="contact-form">
        <h2>¿Cómo podemos ayudarte?</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellido</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">¿En qué podemos ayudarte?</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </section>

      {/* Modal para mostrar el mensaje de agradecimiento */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <p style={{ color: '#000' }}>Gracias por contactarnos. Un asesor de EVOCARS se pondrá en contacto contigo pronto.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;