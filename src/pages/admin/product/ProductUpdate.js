import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getProduct } from '../../../functions/product';
import { getCategories, getCategorySubs } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS', 'MSI', 'Xiaomi'],
    color: '',
    brand: '',
};

const ProductUpdate = ({ match }) => {
    const [values, setValues] = useState(initialState);

    const { user } = useSelector((state) => ({ ...state }));
    let { slug } = match.params;

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = () => {
        getProduct(slug)
            .then((p) => {
                setValues({ ...values, ...p.data });
            })
            .catch((err) => {

            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className='col-md-10'>
                    <h4>Product update</h4>
                    {JSON.stringify(slug)}
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate;
