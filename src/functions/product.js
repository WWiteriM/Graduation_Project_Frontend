import axios from 'axios';

export const createProduct = async (product, authToken) => {
    return await axios.post(`${process.env.REACT_APP_API}/product`, product, {
        headers: {
            authToken
        },
    });
};

export const getProductByCount = async (count) => {
    return await axios.get(`${process.env.REACT_APP_API}/products/${count}`);
};

export const removeProduct = async (slug, authToken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
        headers: {
            authToken
        },
    });
};

export const getProduct = async (slug) => {
    return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);
};

export const updateProduct = async (slug, product, authToken) => {
    return await axios.put(`${process.env.REACT_APP_API}/product/${slug}`, product,{
        headers: {
            authToken
        },
    });
};

export const getProducts = async (sort, order, page) => {
    return await axios.post(`${process.env.REACT_APP_API}/products`, {
        order, sort, page,
    });
};

export const getProductsCount = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/products/total`);
};

export const productStar = async (productId, star, authToken) => {
    return await axios.put(`${process.env.REACT_APP_API}/product/star/${productId}`,
        { star },
        {
            headers: {
                authToken
            },
    });
};

export const getRelated = async (productId) => {
    return await axios.get(`${process.env.REACT_APP_API}/product/related/${productId}`);
};

export const fetchProductsByFilter = async (arg) => {
    return await axios.post(`${process.env.REACT_APP_API}/search/filters`, arg);
};
