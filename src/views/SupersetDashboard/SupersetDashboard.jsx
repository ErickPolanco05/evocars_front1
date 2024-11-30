import React from 'react';
import { EmbedDashboard } from '@superset-ui/embedded-sdk'; // Si tienes configurado el SDK de Superset
import '../SupersetDashboard.css';

const SupersetDashboard = () => {
  const dashboardId = 'ff2ca4d5-432d-4896-a015-9c7afcc83ad2'; // ID proporcionado por Superset

  return (
    <div className="superset-dashboard-container">
      <h1>Dashboard Superset</h1>
      <div className="dashboard-frame">
        {/* Superset embebido con el SDK */}
        <EmbedDashboard
          id={dashboardId}
          width="100%"
          height="600px"
          host="http://localhost:8088/" // URL de tu instancia de Superset
          dashboardId={dashboardId}
          fetchGuestToken={async () => {
            // Implementar la lógica para obtener un token de acceso (si aplica)
          }}
        />
      </div>
    </div>
  );
};

export default SupersetDashboard;
