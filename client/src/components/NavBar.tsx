import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from '../auth/Login';
import Signup from '../auth/Signup';
import CreatePost from '../pages/CreatePost';

const NavBar: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Add this state
    const navigate = useNavigate();

    const handleClick = (component: JSX.Element) => {
        setSelectedComponent(component);
    };

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div className=" min-h-16">
            <nav className="bg-transparent p-2 mt-0 w-full  relative sticky top-0 z-50">
            <div className="flex justify-end items-center">
                {!isLoggedIn && (
                    <>
                        <a className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300  hover:bg-custom-blue active:bg-custom-blue" onClick={() => handleClick(<Signup />)}>Signup</a>
                        <a className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" onClick={() => handleClick(<Login onLoginSuccess={() => setIsLoggedIn(true)} />)}>Login</a>
                    </>
                )}
                <a className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" onClick={() => handleClick(<CreatePost />)}>Create</a>
            </div>
                <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                    <span className="text-black text-2xl font-extrabold cursor-pointer" onClick={navigateHome}>BLOGs</span>
                </div>
            </nav>
            {selectedComponent}
        </div>
    );
};

export default NavBar;