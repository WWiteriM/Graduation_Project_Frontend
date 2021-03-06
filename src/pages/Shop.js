import React, { useState, useEffect } from 'react';
import { getProductByCount, fetchProductsByFilter } from '../functions/product';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Slider, Checkbox, Radio } from 'antd';
import { DollarOutlined, DownSquareOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import { getCategories } from '../functions/category';
import { getSubs } from '../functions/sub';
import ProductCard from '../components/cards/ProductCard';
import Star from '../components/forms/Star';

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState('');
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [brands, setBrands] = useState(['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS', 'MSI', 'Xiaomi']);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(['Black', 'Brown', 'Silver', 'White', 'Blue']);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    let dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        getCategories().then((res) => setCategories(res.data));
        getSubs().then((res) => setSubs(res.data));
    }, []);

    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text });
            if (!text) {
                loadAllProducts();
            }
        }, 500);
        return () => clearTimeout(delayed);
    },[text]);

    useEffect(() => {
        fetchProducts({ price });
    }, [ok]);

    const loadAllProducts = () => {
        getProductByCount(12).then((p) => {
            setProducts(p.data);
            setLoading(false);
        });
    };

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data);
        });
    };

    const handleSlider = (value) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice(value);
        setStar('');
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        setTimeout(() => {
            setOk(!ok);
        }, 500)
    };

    const showCategories = () =>
        categories.map((c) => (
            <div key={c._id}>
                <Checkbox
                    onChange={handleCheck}
                    className='pb-2 pl-4 pr-4'
                    value={c._id}
                    name='category'
                    checked={categoryIds.includes(c._id)}
                >
                    {c.name}
                </Checkbox>
                <br />
            </div>
        ));

    const handleCheck = (e) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setStar('');
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        fetchProducts({ category: inTheState })
    };

    const handleStarClick = (num) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar(num);
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        fetchProducts({ stars: num });
    };

    const showStars = () => (
        <div className='pr-4 pl-4 pb-2'>
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    );

    const showSubs = () =>
        subs.map((s) => (
            <div
                key={s._id}
                onClick={() => handleSub(s)}
                className='p-1 m-1 badge badge-secondary'
                style={{ cursor: 'pointer' }}
            >
                {s.name}
            </div>
        ));

    const handleSub = (sub) => {
        setSub(sub);
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping('');
        fetchProducts({ sub });
    };

    const showBrands = () => brands.map((b) => (
        <Radio
            key={b}
            value={b}
            name={b}
            checked={b === brand}
            onChange={handleBrand}
            className='pb-1 ml-4 pr-5'
            style={{ width: '200px' }}
        >
            {b}
        </Radio>
    ));

    const handleBrand = (e) => {
        setSub('');
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand(e.target.value);
        setColor('');
        setShipping('');
        fetchProducts({ brand: e.target.value });
    };

    const showColors = () => colors.map((c) => (
        <Radio
            key={c}
            value={c}
            name={c}
            checked={c === color}
            onChange={handleColor}
            className='pb-1 ml-4 pr-5'
            style={{ width: '200px' }}
        >
            {c}
        </Radio>
    ));

    const handleColor = (e) => {
        setSub('');
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor(e.target.value);
        setShipping('');
        fetchProducts({ color: e.target.value });
    };

    const showShipping = () => (
        <>
            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value='Yes'
                checked={shipping === 'Yes'}
            >
                Yes
            </Checkbox>

            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value='No'
                checked={shipping === 'No'}
            >
                No
            </Checkbox>
        </>
    );

    const handleShippingChange = (e) => {
        setSub('');
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-2'>
                    <h4>Search/Filter</h4>
                    <hr />

                    <Menu defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} mode='inline'>
                        <SubMenu
                            key='1'
                            title={
                                <span className='h6'>
                                    <DollarOutlined /> Price
                                </span>
                            }
                        >
                            <div>
                                <Slider
                                    className='ml-4 mr-4'
                                    tipFormatter={(v) => `$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max='4999'
                                />
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='2'
                            title={
                                <span className='h6'>
                                    <DownSquareOutlined /> Categories
                                </span>
                            }
                        >
                            <div>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='3'
                            title={
                                <span className='h6'>
                                    <StarOutlined /> Rating
                                </span>
                            }
                        >
                            <div>
                                {showStars()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='4'
                            title={
                                <span className='h6'>
                                    <TagsOutlined /> Sub Categories
                                </span>
                            }
                        >
                            <div className='pl-4 pr-4'>
                                {showSubs()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='5'
                            title={
                                <span className='h6'>
                                    <TagsOutlined /> Brands
                                </span>
                            }
                        >
                            <div className='pr-5'>
                                {showBrands()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='6'
                            title={
                                <span className='h6'>
                                    <TagsOutlined /> Colors
                                </span>
                            }
                        >
                            <div className='pr-5'>
                                {showColors()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='7'
                            title={
                                <span className='h6'>
                                    <TagsOutlined /> Shipping
                                </span>
                            }
                        >
                            <div className='pr-5'>
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>

                <div className='col-md-9 pt-2'>
                    {loading ? (
                        <h4 className='text-danger'>Loading...</h4>
                    ) : (
                        <h4 className='text-danger'>Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className='row pb-5'>
                        {products.map((p) => (
                            <div key={p._id} className='col-md-4 mt-3'>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
