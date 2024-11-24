import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import NotificacionItem from '../../components/NotificacionItem/NotificacionItem';
import './Notificaciones.css';

const Notificaciones = ({ idUsuario, rol }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    newSocket.emit('join', `user_${idUsuario}`);
    return () => newSocket.close();
  }, [idUsuario]);

  const cargarNotificaciones = useCallback(async () => {
    try {
      const res = await fetch(`/api/notificaciones/${idUsuario}`);
      const data = await res.json();
      setNotificaciones(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  }, [idUsuario]);

  useEffect(() => {
    cargarNotificaciones();
    
    if (socket) {
      socket.on('nueva_notificacion', (notificacion) => {
        setNotificaciones(prev => [notificacion, ...prev]);
        new Notification(notificacion.titulo, {
          body: notificacion.mensaje
        });
      });
    }
  }, [socket, cargarNotificaciones]);

  const marcarComoLeida = async (id) => {
    try {
      await fetch(`/api/notificaciones/${id}/leer`, {
        method: 'PUT'
      });
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  return (
    <div className="notificaciones-vista">
      <h2>Notificaciones</h2>
      <div className="notificaciones-container">
        {notificaciones.length === 0 ? (
          <div className="no-notificaciones">
            No tienes notificaciones nuevas
          </div>
        ) : (
          notificaciones.map(notif => (
            <NotificacionItem
              key={notif.id}
              notificacion={notif}
              onMarcarLeida={marcarComoLeida}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notificaciones;