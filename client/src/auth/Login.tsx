import React, { useState, useContext } from 'react';
import passwordValidator from 'password-validator';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './Context'; // replace with the actual path to your AuthContext
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showForm, setShowForm] = useState(true);
    const navigate = useNavigate();

    // const { setAccessToken, setRefreshToken } = useContext(AuthContext);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Submit the form to /login API
        try {
            const response = await api.post('/login', { username, password });
    
            if (response.status === 200) {
                // Store the tokens in local storage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // Update the tokens in the context
                // setAccessToken(response.data.accessToken);
                // setRefreshToken(response.data.refreshToken);
    
                toast.success('Login successful', {
                    position: "top-right",
                    autoClose: 5000
                });
                setUsername(''); // Clear the username field
                setPassword(''); // Clear the password field
                navigate('/create'); // Redirect to create page
            } else {
                toast.error('Login failed', {
                    position: "top-right",
                    autoClose: 5000
                });
                setUsername(''); // Clear the username field
                setPassword(''); // Clear the password field
            }
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.detail || 'An error occurred while logging in';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });
            setUsername(''); // Clear the username field
            setPassword(''); // Clear the password field
        }
    };

    if (!showForm) {
        return null;
    }
    return (
        <div className="min-h-20vh flex justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-md w-full space-y-1">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-5">Login</h2>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                type="username"
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
                                onChange={handlePasswordChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue overflow-hidden"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;