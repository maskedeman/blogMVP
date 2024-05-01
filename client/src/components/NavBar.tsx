import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSession } from './Hooks'

const NavBar: React.FC = () => {
    const {  signOut } = useSession();
    const username = localStorage.getItem('username');
    const isAuthenticated=localStorage.getItem('isAuthenticated');;

    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
console.log(username);
    const signOutAndNotify = () => {
        signOut();
        toast.success("You have successfully logged out.");
        setTimeout(() => {
        }, 2000); 
    };

    const navigateHome = () => {
        navigate('/posts');
    };

    return (
        <div className="min-h-10">
            <nav className="bg-white border-b-2 p-2 mt-0 w-full relative sticky top-0 z-50">
                <div className="flex justify-end items-center">
                    {!isAuthenticated && (
                        <>
                            <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" to="/signup">Signup</Link>
                            <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" to="/login">Login</Link>
                        </>
                    )}
                    <Link className="mr-2 py-1 px-4 border-2 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue" to="/create">Create</Link>
                    {isAuthenticated && (
                        <>
     <div className="relative">
    <button 
        className="mr-2 py-1 px-4 border-2 border-black text-blue-700 bg-blue-300 rounded cursor-pointer hover:bg-red-300 active:bg-blue-300"
        onMouseEnter={() => setDropdownVisible(true)}
    >
        {username}
    </button>
    {dropdownVisible && (
        <div 
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            onMouseLeave={() => setDropdownVisible(false)}
        >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button 
                    className="block px-14 py-2 text-sm  text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                    role="menuitem"
                    onClick={() => navigate('/update-user')}
                >
                    Update User
                </button>
                <button 
                    className="block px-16 py-2 text-sm  text-pink-800 hover:bg-pink-200 hover:text-pink-900"
                    role="menuitem"
                    onClick={() => navigate('/my-posts')}
                >
                    My Posts
                </button>
            </div>
        </div>
    )}
</div>
      <button 
                                className='mr-2 py-1 px-4 border-2 border-black text-red-700 bg-red-200 rounded cursor-pointer hover:text-yellow-300 hover:bg-custom-blue active:bg-custom-blue' 
                                onClick={signOutAndNotify}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
                <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                    <span className="text-black text-2xl font-extrabold cursor-pointer" onClick={navigateHome}>BLOGs</span>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;