import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentForm.css';

const PaymentForm = ({ autoId, startDate, endDate, priceDetails, onPaymentCompleted }) => {
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const tokenWeb = localStorage.getItem('token');
    const JSONUser = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(JSONUser);

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentMethod === 'paypal' && window.paypal) {
            window.paypal.Buttons({
                createOrder: async () => {
                    try {
                        const response = await axios.post(
                            'https://evocars-cristian-ps-projects.vercel.app/api/rentals/process-payment',
                            {
                                id: userInfo.id_usuario,
                                email: userInfo.email,
                                amount: priceDetails.precio_final,
                                autoId,
                                startDate: startDate.toISOString().split('T')[0],
                                endDate: endDate.toISOString().split('T')[0],
                                paymentMethod: 'paypal',
                                paymentToken: '',
                                sucursalId: '1',
                                cuponCodigo: priceDetails.descuento_cupon || null,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${tokenWeb}`,
                                },
                            }
                        );
                        return response.data.orderID; // Devuelve el ID de la orden creada por tu backend
                    } catch (error) {
                        setError('Error al crear la orden de PayPal.');
                        console.error(error);
                    }
                },
                onApprove: async (data) => {
                    try {
                        const response = await axios.post(
                            'https://evocars-cristian-ps-projects.vercel.app/api/rentals/capture-payment',
                            {
                                orderID: data.orderID, // ID de la orden aprobada por PayPal
                                payerID: data.payerID,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${tokenWeb}`,
                                },
                            }
                        );
                        onPaymentCompleted(response.data); // Maneja la finalización del pago
                    } catch (error) {
                        setError('Error al capturar el pago.');
                        console.error(error);
                    }
                },
                onError: (err) => {
                    setError('Error en el proceso de PayPal.');
                    console.error(err);
                },
            }).render('#paypal-button-container');
        }
    }, [paymentMethod, autoId, startDate, endDate, priceDetails, tokenWeb, userInfo, onPaymentCompleted]);

    const handlePayment = async () => {
        if (paymentMethod === 'stripe') {
            setLoading(true);
            setError(null);

            try {
                const cardElement = elements.getElement(CardElement);

                        // Crear un token de tarjeta
                        const { token, error } = await stripe.createToken(cardElement);

                        if (error) {
                        console.error('Error creando token:', error.message);
                        return;
                        }

                
                const response = await axios.post(
                    'https://evocars-cristian-ps-projects.vercel.app/api/rentals/process-payment',
                    { id: userInfo.id_usuario,
                        email: userInfo.email,
                        amount: priceDetails.precio_final,
                        autoId,
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        paymentMethod: 'stripe',
                        paymentToken: token.id,
                        sucursalId: '1',
                        cuponCodigo: priceDetails.descuento_cupon || null, },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenWeb}`,
                        },
                    }
                );

                const result = await stripe.confirmCardPayment(response.data.payment_details.client_secret
                    , {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: 'Cliente Ejemplo',
                        },
                    },
                });

                if (result.error) {
                    throw new Error(result.error.message);
                }

                alert('¡Reserva completada con éxito!');
                navigate(`/cars`);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="payment-form">
            <h3>Método de Pago</h3>
            <div className="payment-methods">
                <button
                    className={`payment-method ${paymentMethod === 'stripe' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('stripe')}
                >
                    Tarjeta de Crédito/Débito
                </button>
                <button
                    className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    PayPal
                </button>
            </div>

            {paymentMethod === 'stripe' && (
                <div className="stripe-form">
                    <CardElement />
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div id="paypal-button-container"></div>
            )}

            {error && <div className="payment-error">{error}</div>}

            {paymentMethod === 'stripe' && (
                <button
                    className="pay-button"
                    onClick={handlePayment}
                    disabled={loading || !stripe || !elements}
                >
                    {loading ? 'Procesando...' : `Pagar $${priceDetails.precio_final}`}
                </button>
            )}
        </div>
    );
};

export default PaymentForm;
