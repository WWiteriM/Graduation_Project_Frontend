import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createPaymentIntent } from '../functions/stripe';

const StripeCheckout = ({ history }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        createPaymentIntent(user.token).then((res) => {
            console.log(res.data.clientSecret);
            setClientSecret(res.data.clientSecret);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: e.target.value,
                },
            },
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`)
            setProcessing(false)
        } else {
            console.log(JSON.stringify(payload, null, 4))
            setError(null)
            setProcessing(false)
            setSucceeded(true)
        }
    };

    const handleChange = async (e) => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : '');
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <>
            <p className={succeeded ? 'result-message' : 'result-message hidden'}>
                Payment Successful.{' '}
                <Link to='/user/history'>See it in your purchase history.</Link>
            </p>
            <form
                id='payment-form'
                className='stripe-form'
                onSubmit={handleSubmit}
            >
                <CardElement id='card-element' options={cardStyle} onChange={handleChange} />
                <button className='stripe-button' disabled={processing || disabled || succeeded}>
                    <span id='button-text'>
                        {processing ? <div className='spinner' id='spinner' /> : 'Pay'}
                    </span>
                </button>
            </form>
            {error && <div className='card-error' role='alert'>{error}</div>}
        </>
    )
};

export default StripeCheckout;
