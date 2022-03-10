import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../functions/category';
import { createSub, getSubs, removeSub, getSub } from '../../../functions/sub';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const SubCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subs, setSubs] = useState([]);
    const [keyword, setKeyword] = useState('');

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
        loadSubs();
    }, []);

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data));
    }

    const loadSubs = () => {
        getSubs().then((s) => setSubs(s.data));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createSub({ name, parent: category }, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" created`);
                loadSubs();
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            })
    };

    const handleRemove = async (slug) => {
        if (window.confirm("Are you sure you want to delete?")) {
            setLoading(true);
            removeSub(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.success(`"${res.data.name}" deleted`);
                    loadSubs();
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
                        <h4>Create sub category</h4>
                    )}
                    <div className='form-group'>
                        <label>Parent category</label>
                        <select
                            name='category'
                            className='form-control'
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Empty option</option>
                            {categories.length > 0 && categories.map((c) => (
                                <option key={c.id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                    <LocalSearch setKeyword={setKeyword} keyword={keyword} />
                    <hr />
                    {subs.filter(searched(keyword)).map((s) => (
                        <div key={s._id} className='alert alert-secondary'>
                            {s.name}
                            <span onClick={() => handleRemove(s.slug)} className='btn btn-sm float-right'>
                                <DeleteOutlined className='text-danger' />
                            </span>
                            <Link to={`/admin/sub/${s.slug}`}>
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

export default SubCreate;

