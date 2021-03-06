import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminNav from '../../../components/nav/AdminNav';
import { getProductByCount, removeProduct } from '../../../functions/product';
import AdminProductCard from '../../../components/cards/AdminProductCard';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllProducts();
    }, [])

    const loadAllProducts = () => {
        setLoading(true);
        getProductByCount(100)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    const handleRemove = (slug) => {
        let answer = window.confirm("Are you sure you want to delete?");
        if (answer) {
            removeProduct(slug, user.token)
                .then((res) => {
                    loadAllProducts();
                    toast.success(`${res.data.title} deleted successfully`);
                })
                .catch((err) => {
                    if (err.response.status === 400) toast.error(err.response.data)
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (
                        <h4 className='text-danger'>Loading</h4>
                    ) : (
                        <h4>All Products</h4>
                    )}
                    <div className='row'>
                        {products.map((product) => (
                            <div className='col-md-4 pb-3' key={product._id}>
                                <AdminProductCard product={product} handleRemove={handleRemove} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
