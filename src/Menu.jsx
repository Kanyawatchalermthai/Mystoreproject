import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react'

const Menu = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = (route) => {
        navigate(route);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Remove token from sessionStorage
        //delete axios.defaults.headers.common["Authorization"];
        setAuth(false);
        navigate('/');
    };

    return (  
        <nav className="Menu">
            <h1>Lily Lane Blooms ✿</h1>
            <div className="links">
                { auth ? (<a onClick={() => handleClick('/addProduct')}>Add Product</a>) : (<a style={{visibility: "hidden"}} onClick={() => handleClick('/addProduct')}>Add Product</a>) }
                <a onClick={() =>handleClick('/')}>Home</a> 
                { auth ? (<a onClick={() => handleLogout()}>Log Out</a>) : (<a onClick={() => handleClick('/login')}>Log In</a>) }
            </div>
        </nav>

    );
}

export default Menu;