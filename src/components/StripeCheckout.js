import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons';
import { createPaymentIntent } from '../functions/stripe';
import { createOrder, emptyUserCart } from '../functions/user';
import laptop from '../images/laptop.jpg';

const StripeCheckout = ({ history }) => {
    const dispatch = useDispatch();
    const { user, coupon, cart } = useSelector((state) => ({ ...state }));
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        createPaymentIntent(user.token, coupon).then((res) => {
            setClientSecret(res.data.clientSecret);
            setCartTotal(res.data.cartTotal);
            setTotalAfterDiscount(res.data.totalAfterDiscount);
            setPayable(res.data.payable);
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
            createOrder(payload, user.token).then((res) => {
                if (res.data.ok) {
                    if (typeof window !== 'undefined') localStorage.removeItem('cart')
                    dispatch({
                        type: 'ADD_TO_CART',
                        payload: [],
                    });
                    dispatch({
                        type: 'COUPON_APPLIED',
                        payload: false,
                    });
                    emptyUserCart(user.token);
                }
            })
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
            {!succeeded && (
                <div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
                    ) : (
                        <p className='alert alert-danger'>No coupon applied</p>
                    )}
                </div>
            )}
            <div className='text-center pb-5'>
                <Card
                    cover={
                        <img
                            // cart[0].images && cart[0].images.length ? cart[0].images[0].url : laptop
                            src={laptop}
                            style={{
                                height: '230px',
                                objectFit: 'cover',
                                marginBottom: '-50px'
                            }}
                            className='p-1'
                        />
                    }
                    actions={[
                        <>
                            <DollarOutlined className='text-info' /><br /> Total: $
                            {cartTotal}
                        </>,
                        <>
                            <CheckOutlined className='text-info' /><br /> Total payable: $
                            {(payable / 100).toFixed(2)}
                        </>
                    ]}
                />
            </div>

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
            <br />
            <p className={succeeded ? 'result-message' : 'result-message hidden'}>
                Payment Successful.{' '}
                <Link to='/user/history'>See it in your purchase history.</Link>
            </p>
        </>
    )
};

export default StripeCheckout;
