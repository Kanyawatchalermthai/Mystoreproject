import { useState, useEffect, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import ProductBlogs from './ProductBlogs'
import useAxios from './useAxios'
import Menu from './Menu'
import './index.css'
import api from './api';
import AuthContext from './AuthContext';

function App() {
    const {data: products, isLoading} = useAxios('/product')
    const {auth, setAuth} = useContext(AuthContext);

    // useEffect(() => {
    //     axios.get('http://localhost:3000/product')
    //         .then((res) => res.data)
    //         .then(data => {
    //             setProducts(data);
    //             setIsLoading(false);  // การโหลดเสร็จสิ้น
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             setIsLoading(false);  // การโหลดเสร็จสิ้นแม้เกิดข้อผิดพลาด
    //         });
    // }, []);

    return (
        <div className= "App">
            <Menu />
            <div className="content">
                {isLoading && <div>Loading...</div>} {/*โหลดข้อมูลมาก่อน*/}
                {products && <ProductBlogs products={products} />}
                {/* <Catalog /> */}
            </div>
        </div>
    );
}

export default App
