import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ProductCreateForm = ({ handleSubmit, handleChange, values, handleCategoryChange, subOptions, showSub, setValues }) => {
    const {
        title,
        description,
        price,
        categories,
        category,
        subs,
        shipping,
        quantity,
        images,
        colors,
        brands,
        color,
        brand
    } = values;

    return (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Title</label>
                <input
                    type='text'
                    name='title'
                    className='form-control'
                    value={title}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label>Description</label>
                <input
                    type='text'
                    name='description'
                    className='form-control'
                    value={description}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label>Price</label>
                <input
                    type='number'
                    name='price'
                    className='form-control'
                    value={price}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label>Shipping</label>
                <select name='shipping' className='form-control' onChange={handleChange}>
                    <option>Empty option</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>

            <div className='form-group'>
                <label>Quantity</label>
                <input
                    type='number'
                    name='quantity'
                    className='form-control'
                    value={quantity}
                    onChange={handleChange}
                />
            </div>

            <div className='form-group'>
                <label>Color</label>
                <select name='color' className='form-control' onChange={handleChange}>
                    <option>Empty option</option>
                    {colors.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className='form-group'>
                <label>Brand</label>
                <select name='brand' className='form-control' onChange={handleChange}>
                    <option>Empty option</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <div className='form-group'>
                <label>Category</label>
                <select
                    name='category'
                    className='form-control'
                    onChange={handleCategoryChange}
                >
                    <option>Empty option</option>
                    {categories.length > 0 && categories.map((c) => (
                        <option key={c.id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {showSub && (
                <div className='form-group'>
                    <label>Sub category</label>
                    <Select
                        onChange={(value) => setValues({ ...values, subs: value })}
                        value={subs}
                        placeholder='Please select'
                        style={{ width: '100%' }}
                        mode='multiple'
                    >
                        {subOptions.length && subOptions.map((s) => (
                            <Option key={s._id} value={s._id}>
                                {s.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            )}

            <button className='btn btn-outlined-info'>Save</button>
        </form>
    );
}

export default ProductCreateForm;
