import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createCategory, getCategories, removeCategory } from '../../../functions/category';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createCategory({ name }, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" created`);
                loadCategories();
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            })
    };

    const handleRemove = async (slug) => {
        if (window.confirm("Are you sure you want to delete?")) {
            setLoading(true);
            removeCategory(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.success(`"${res.data.name}" deleted`);
                    loadCategories();
                })
                .catch((err) => {
                    if (err.response.satus === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                });
        }
    };

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (
                        <h4 className='text-danger'>Loading...</h4>
                    ) : (
                        <h4>Create category</h4>
                    )}
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                    <LocalSearch setKeyword={setKeyword} keyword={keyword} />
                    <hr />
                    {categories.filter(searched(keyword)).map((c) => (
                        <div key={c._id} className='alert alert-secondary'>
                            {c.name}
                            <span onClick={() => handleRemove(c.slug)} className='btn btn-sm float-right'>
                                <DeleteOutlined className='text-danger' />
                            </span>
                            <Link to={`/admin/category/${c.slug}`}>
                                <span className='btn btn-sm float-right'>
                                    <EditOutlined className='text-warning' />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;
