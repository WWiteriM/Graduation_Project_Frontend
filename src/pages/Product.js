import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getProduct, productStar, getRelated } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import ProductCard from '../components/cards/ProductCard';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});
    const [star, setStar] = useState(0);
    const [related, setRelated] = useState([]);
    const { slug } = match.params;
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find(
                (ele) => ele.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);
        }
    });

    const loadSingleProduct = () => {
        getProduct(slug).then((res) => {
            setProduct(res.data);
            getRelated(res.data._id).then((res) => setRelated(res.data));
        });
    };

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, newRating, user.token).then(() => {
            loadSingleProduct();
        })
    };

    return (
        <div className='container-fluid'>
            <div className='row pt-4'>
                <SingleProduct product={product} onStarClick={onStarClick} star={star}/>
            </div>

            <div className='row p-5'>
                <div className='col text-center pt-5'>
                    <hr />
                    <h4>Related products</h4>
                    <hr />
                </div>
            </div>
            <div className='row pb-5'>{related.length ? related.map((r) => (
                    <div key={r._id} className='col-md-4'>
                        <ProductCard product={r} />
                    </div>
                )) : (
                    <div className='text-center col'>
                        <h6>No products found</h6>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Product;
