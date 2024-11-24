// src/components/RenterRoute.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RenterRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isRenter, setIsRenter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRenter = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!user || !token || user.id_rol !== 2) {
          navigate('/login');
          return;
        }
        
        setIsRenter(true);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkRenter();
  }, [navigate]);

  if (loading) {
    return <div>Verificando permisos...</div>;
  }

  return isRenter ? children : null;
};

export default RenterRoute;