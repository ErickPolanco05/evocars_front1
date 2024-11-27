// src/components/NotificationPermission.jsx
import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

const NotificationPermission = ({ id_rol }) => {
  const [permission, setPermission] = useState('default');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await notificationService.initialize();
      setIsSupported(supported);
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  const handleSubscribe = async () => {
    try {
      setError(null);
      await notificationService.subscribeToPush(id_rol);
      setPermission('granted');
    } catch (err) {
      setError(err.message);
      console.error('Error subscribing:', err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setError(null);
      await notificationService.unsubscribe();
      setPermission('default');
    } catch (err) {
      setError(err.message);
      console.error('Error unsubscribing:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-100 p-4 rounded-md">
        <p className="text-yellow-700">
          Las notificaciones no están soportadas en este navegador.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
      
      {error && (
        <div className="bg-red-100 p-3 rounded-md mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {permission === 'granted' ? (
        <div>
          <p className="text-green-600 mb-2">
            ✓ Las notificaciones están activadas
          </p>
          <button
            onClick={handleUnsubscribe}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Desactivar notificaciones
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">
            Recibe notificaciones sobre {id_rol === 1 ? 'nuevos autos disponibles' : 'nuevas reservas'}
          </p>
          <button
            onClick={handleSubscribe}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Activar notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPermission;