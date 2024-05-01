import React, { useState, useContext } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const UpdateUser: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const updatedUser = {
            username,
            password,
        };
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                 toast.error('Access token not found');
            }
            const response = await api.put(`/user/${user?.user_id}`, updatedUser,{
                
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });
            if (response && response.status === 200) {
                toast.success('User updated successfully', {
                    position: "top-right",
                    autoClose: 5000
                });
                setTimeout(() => {
                    navigate('/posts');
                }, 2000);
            } else {
                console.error('response is undefined or status is not a property of response');
            }
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.detail || 'An error occurred while updating user';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });
            setUsername(''); 
            setPassword(''); 
        }
    };

    return (
        <div className="min-h-20vh flex justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-md w-full space-y-1">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-5">Update User</h2>
                <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue overflow-hidden"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser;