import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Función para registrar el service worker
const registerServiceWorker = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/"
      });
      
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }

      // Manejo de actualizaciones
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("New service worker available");
            // Aquí podrías mostrar un mensaje al usuario para recargar la página
          }
        });
      });

      console.log("Service Worker registrado con éxito:", registration.scope);
    }
  } catch (error) {
    console.error("Error al registrar el Service Worker:", error);
  }
};

// Función para inicializar la aplicación
const initializeApp = () => {
  const container = document.getElementById("root");
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Inicializar la aplicación y registrar el service worker
const start = async () => {
  try {
    await registerServiceWorker();
    initializeApp();
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    // Inicializar la aplicación incluso si falla el registro del service worker
    initializeApp();
  }
};

// Iniciar la aplicación cuando se cargue la ventana
window.addEventListener("load", start);

// Manejar actualizaciones del service worker
let refreshing = false;
navigator.serviceWorker?.addEventListener("controllerchange", () => {
  if (!refreshing) {
    refreshing = true;
    window.location.reload();
  }
});