import React, { useState, useEffect } from 'react';

const ConnectionStatus = ({ setIsOnline }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isOnlineState, setIsOnlineState] = useState(navigator.onLine);

  useEffect(() => {
    // Sincronizar el estado global de conexión
    setIsOnline(isOnlineState);

    const handleOnline = () => {
      setIsOnlineState(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Notificación por 3 segundos
    };

    const handleOffline = () => {
      setIsOnlineState(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnlineState, setIsOnline]);

  // No mostrar nada si la notificación está oculta
  if (!showNotification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: isOnlineState ? '#4CAF50' : '#f44336',
        color: 'white',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
      }}
    >
      {isOnlineState ? 'Conexión restablecida' : 'Sin conexión a internet'}
    </div>
  );
};

export default ConnectionStatus;