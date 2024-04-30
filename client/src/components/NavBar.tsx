import React, { useState,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Login from '../auth/Login';
import Signup from '../auth/Signup';
import CreatePost from '../pages/CreatePost';
import {useSession} from './Hooks'



const NavBar: React.FC = () => {
    const { user, isAuthenticated, signOut } = useSession();
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/posts');
    };

    return (
        <div className=" min-h-16">
            <nav className="bg-transparent p-2 mt-0 w-full  relative sticky top-0 z-50">
                <div className="flex justify-end items-center">
                    {!isAuthenticated && (
                        <>
                            <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300  hover:bg-custom-blue active:bg-custom-blue" to="/signup">Signup</Link>
                            <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" to="/login">Login</Link>
                        </>
                    )}
                    <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" to="/create">Create</Link>
                </div>
                <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                    <span className="text-black text-2xl font-extrabold cursor-pointer" onClick={navigateHome}>BLOGs</span>
                </div>
                {isAuthenticated && (
                    <>
                        <span style={{ marginRight: 4 }}>{user?.email}</span>
                        <button onClick={signOut}>Logout</button>
                    </>
                )}
            </nav>
        </div>
    );
};

export default NavBar;