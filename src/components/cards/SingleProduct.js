import React, { useState } from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import StarRating from 'react-star-ratings';
import _ from 'lodash';
import Laptop from '../../images/laptop.jpg';
import ProductListItems from './ProductListItems';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import { addToWishlist } from '../../functions/user';
import {toast} from "react-toastify";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, images, description, _id } = product;
    const [tooltip, setTooltip] = useState('Click to add');

    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();
    const history = useHistory();
    const role = localStorage.getItem('role');

    const handleAddToCart = () => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.push({
                ...product,
                count: 1,
            });

            let unique = _.uniqWith(cart, _.isEqual);
            localStorage.setItem('cart', JSON.stringify(unique));
            setTooltip('Added');

            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            });
            dispatch({
                type: 'SET_VISIBLE',
                payload: true,
            });
        }
    };

    const handleActions = () => {
        if (role === 'admin') {
            return [
                <Tooltip title={tooltip}>
                    <a onClick={handleAddToCart}>
                        <ShoppingCartOutlined  className='text-danger' /> <br /> Add to Cart
                    </a>
                </Tooltip>,
                <RatingModal>
                    <StarRating
                        name={_id}
                        numberOfStars={5}
                        rating={star}
                        changeRating={onStarClick}
                        isSelectable={true}
                        starRatedColor='red'
                    />
                </RatingModal>
            ]
        } else {
            return [
                <Tooltip title={tooltip}>
                    <a onClick={handleAddToCart}>
                        <ShoppingCartOutlined  className='text-danger' /> <br /> Add to Cart
                    </a>
                </Tooltip>,
                <a onClick={handleAddToWishlist}>
                    <HeartOutlined className='text-info' /> <br /> Add to Wishlist
                </a>,
                <RatingModal>
                    <StarRating
                        name={_id}
                        numberOfStars={5}
                        rating={star}
                        changeRating={onStarClick}
                        isSelectable={true}
                        starRatedColor='red'
                    />
                </RatingModal>
            ]
        }
    }

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
            toast.success('Added to wishlist');
            history.push('/user/wishlist');
        });
    };

    return (
        <>
            <div className='col-md-6'>
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) => <img src={i.url} key={i.public_id} />) }
                    </Carousel>
                ) : (
                    <Card
                        cover={
                            <img
                                src={Laptop}
                                className='mb-3 card-image'
                            />
                        }
                    />
                )}

                <Tabs type='card'>
                    <TabPane tab='Description' key='1'>
                        {description && description}
                    </TabPane>
                    <TabPane tab='More' key='2'>
                        Свяжитесь по телефону +375(хх)ххх-хх-хх для получения информации о товаре
                    </TabPane>
                </Tabs>
            </div>

            <div className='col-md-6'>
                <h1 className='bg-info p-3'>{title}</h1>
                {product && product.ratings && product.ratings.length > 0
                    ? showAverage(product)
                    : (
                        <div className='text-center pt-1 pb-3'>No rating yet</div>
                    )}

                <Card
                    actions={handleActions()}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    )
}

export default SingleProduct;
