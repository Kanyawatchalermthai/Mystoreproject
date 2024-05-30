//import e from 'express';
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'; // import axios ที่นี่
import './index.css';
import api from './api';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [type, setType] = useState('S');
    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง
    const {auth, setAuth} = useContext(AuthContext);

    const [product, setProduct] = useState({
        productName: '',
        productPrice: '',
        productDescription: '', // เพิ่ม field productDescription
        type: '',
        image: ''
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        const imgUrl = await upload();
        console.log(imgUrl)
        try {
            //const token = localStorage.getItem('token');
            console.log(product.image)
            await api.post('/products', {
              name:productName,
              image:imgUrl,
              price:productPrice,
              description:productDescription,
              type:type
            }, {
               
                //  headers: { 
                //            'Authorization': `Bearer ${token}`
                //  } // กำหนด header
              });
    
              // Redirect to Home
              navigate('/'); 
    
        // handle success
        //alert('เพิ่มสินค้าสำเร็จ');
        setProduct({
            productName: '',
            productPrice: '',
            productDescription: '',
            type: '',
            image: null
        });
          // handle success, e.g., redirect to product list or show a success message
          
        } catch (err) {
          // handle error, e.g., show an error message
        }
      };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
          setProduct({ ...product, image: e.target.files[0] }); // เก็บไฟล์รูปภาพ
        } else {
          setProduct({ ...product, [e.target.name]: e.target.value });
        }
    }

    const upload = async () => {
        try {
            console.log(product.productName);
          const formData = new FormData();
          formData.append("file", product.image);
          console.log(product.image)
          const res = await api.post("/upload", formData);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };

      return (
        <div className="add-product-page">
            <div className="add-product-container">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-group">
                        <label>Product Name:</label>
                        <input 
                            type="text" 
                            required
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Price:</label>
                        <input
                            type="text"
                            required
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Product Description:</label>
                        <textarea 
                            required
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Product Type:</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Product Image:</label>
                        <input type="file" accept="image/*" name="image" onChange={handleChange} />
                    </div>
                    <button type="submit" className="add-product-button">Add Product</button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;