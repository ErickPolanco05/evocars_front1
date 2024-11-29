import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PriceCalculator.css';


const PriceCalculator = ({ autoId, startDate, endDate, onPriceCalculated }) => {
    const [priceDetails, setPriceDetails] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (startDate && endDate) {
        calculatePrice();
      }
    }, [startDate, endDate, couponCode]);
  
    const calculatePrice = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8080/api/rentals/calculate-price', {
          autoId,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          cuponCodigo: couponCode || null
        });
  
        setPriceDetails(response.data);
        onPriceCalculated(response.data);
      } catch (error) {
        console.error('Error calculating price:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (!startDate || !endDate) return null;
  
    return (
      <div className="price-calculator">
        <h3>Detalles del Precio</h3>
        <div className="coupon-input">
          <input
            type="text"
            placeholder="Código de cupón"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={calculatePrice}>Aplicar Cupón</button>
        </div>
        
        {loading ? (
          <p>Calculando precio...</p>
        ) : priceDetails && (
          <div className="price-details">
            <p>Precio base: ${priceDetails.precio_base}</p>
            {priceDetails.descuento_oferta > 0 && (
              <p>Descuento por oferta: -${priceDetails.descuento_oferta}</p>
            )}
            {priceDetails.descuento_cupon > 0 && (
              <p>Descuento por cupón: -${priceDetails.descuento_cupon}</p>
            )}
            <p className="total-price">Precio final: ${priceDetails.precio_final}</p>
          </div>
        )}
      </div>
    );
  };
  export default PriceCalculator;
