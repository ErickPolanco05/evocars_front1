const API_URL = 'https://evocars-cristian-ps-projects.vercel.app';

class NotificationService {
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error al solicitar permiso:', error);
      return false;
    }
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Error al registrar service worker:', error);
      throw error;
    }
  }

  async subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Obtener la clave pública del servidor
      const response = await fetch(`${API_URL}/api/notifications/vapid-public-key`);
      const { publicKey } = await response.json();

      // Obtener suscripción existente o crear una nueva
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicKey)
        });
      }

      return subscription;
    } catch (error) {
      console.error('Error al suscribirse a notificaciones:', error);
      throw error;
    }
  }

  async savePushSubscription(subscription, userId) {
    try {
      const response = await fetch(`${API_URL}/api/notifications/save-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId,
          roleId: 1 // Ajusta según el rol del usuario
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la suscripción en el servidor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al guardar suscripción:', error);
      throw error;
    }
  }

  // Utilidad para convertir la clave VAPID
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export default new NotificationService();