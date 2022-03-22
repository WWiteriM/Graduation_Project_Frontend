import React from 'react';
import { Card, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Laptop from '../../images/laptop.jpg';
import ProductListItems from './ProductListItems';

const { TabPane } = Tabs;

const SingleProduct = ({ product }) => {
    const { title, images, description } = product;

    return (
        <>
            <div className='col-md-6'>
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
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
                        Call use on xxxx xxx xxx to learn more about this product
                    </TabPane>
                </Tabs>
            </div>

            <div className='col-md-6'>
                <h1 className='bg-info p-3'>{title}</h1>
                <Card
                    actions={[
                        <>
                            <ShoppingCartOutlined className='text-success' /> <br /> Add to Cart
                        </>,
                        <Link to='/'>
                            <HeartOutlined className='text-info' /> <br /> Add to Wishlist
                        </Link>
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    )
}

export default SingleProduct;
