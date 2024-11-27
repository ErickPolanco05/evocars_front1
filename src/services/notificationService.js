// src/services/notificationService.js

class NotificationService {
    constructor() {
      // URL fija del backend en Vercel
      this.baseUrl = 'https://evocars-cristian-ps-projects.vercel.app';
      this.swRegistration = null;
    }
  
    async initialize() {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          console.warn('Push notifications not supported');
          return false;
        }
  
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
        return true;
      } catch (error) {
        console.error('Error registering service worker:', error);
        return false;
      }
    }
  
    async getVapidPublicKey() {
      try {
        const response = await fetch(`${this.baseUrl}/api/push/vapidPublicKey`);
        const data = await response.json();
        return data.publicKey;
      } catch (error) {
        console.error('Error getting VAPID key:', error);
        throw error;
      }
    }
  
    async subscribeToPush(id_rol) {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permiso no otorgado para notificaciones');
        }
  
        const publicKey = await this.getVapidPublicKey();
        const subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey
        });
  
        await this.saveSubscription(subscription, id_rol);
        return subscription;
      } catch (error) {
        console.error('Error subscribing to push:', error);
        throw error;
      }
    }
  
    async saveSubscription(subscription, id_rol) {
      try {
        const response = await fetch(`${this.baseUrl}/api/push/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription,
            id_rol
          })
        });
  
        if (!response.ok) {
          throw new Error('Error al guardar la suscripción');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error saving subscription:', error);
        throw error;
      }
    }
  
    async unsubscribe() {
      try {
        const subscription = await this.swRegistration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await this.deleteSubscription(subscription.endpoint);
        }
      } catch (error) {
        console.error('Error unsubscribing:', error);
        throw error;
      }
    }
  
    async deleteSubscription(endpoint) {
      try {
        const response = await fetch(`${this.baseUrl}/api/push/unsubscribe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint })
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar la suscripción');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        throw error;
      }
    }
  
    // Método para verificar si ya existe una suscripción
    async checkSubscription() {
      try {
        if (!this.swRegistration) {
          await this.initialize();
        }
        const subscription = await this.swRegistration.pushManager.getSubscription();
        return !!subscription;
      } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
      }
    }
  }
  
  export default new NotificationService();