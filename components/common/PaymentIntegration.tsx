import React, { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import notificationService from '../../services/notificationService';
import LoadingSpinner from './LoadingSpinner';

// Use a public key for testing purposes.
// Replace with your actual public key in a real application.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      notificationService.showToast('Stripe is not ready yet. Please wait.', 'info');
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        notificationService.showToast('Card details not found.', 'error');
        setIsLoading(false);
        return;
    }

    // In a real app, you would create a payment intent on your server
    // and use the client secret here.
    // For this demo, we'll simulate the process.
    console.log('Simulating payment process...');
    
    // Simulate API call to the backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate a successful payment
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    setIsLoading(false);

    if (error) {
      console.error(error);
      notificationService.showToast(error.message || 'Payment failed.', 'error');
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      notificationService.showToast('Payment successful!', 'success');
      // Here you would send the paymentMethod.id to your server
    }
  };
  
  const cardElementOptions = {
      style: {
          base: {
              color: '#32325d',
              fontFamily: 'Arial, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                  color: '#aab7c4'
              }
          },
          invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
          }
      }
  };

  return (
    <div className="form-container" style={{maxWidth: '500px', margin: 'auto'}}>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Card Details</label>
                <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px' }}>
                    <CardElement options={cardElementOptions} />
                </div>
            </div>
            <button type="submit" disabled={!stripe || isLoading} style={{width: '100%'}}>
                 {isLoading ? <LoadingSpinner size="small" /> : 'Pay Now'}
            </button>
        </form>
    </div>
  );
};

const PaymentIntegration = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentIntegration;
