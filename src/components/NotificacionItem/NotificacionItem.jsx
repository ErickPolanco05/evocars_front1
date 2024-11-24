import React from 'react';
import './NotificacionItem.css';

const NotificacionItem = ({ notificacion, onMarcarLeida }) => {
  const { id, titulo, mensaje, fecha_creacion, leido } = notificacion;

  return (
    <div 
      className={`notificacion-item ${leido ? 'leida' : 'no-leida'}`}
      onClick={() => onMarcarLeida(id)}
    >
      <div className="notificacion-header">
        <h4>{titulo}</h4>
        {!leido && <span className="badge">Nueva</span>}
      </div>
      <p>{mensaje}</p>
      <small>{new Date(fecha_creacion).toLocaleString()}</small>
    </div>
  );
};

export default NotificacionItem;