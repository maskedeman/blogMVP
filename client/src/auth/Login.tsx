import React, { useState, useContext } from 'react';
import passwordValidator from 'password-validator';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './Context'; // replace with the actual path to your AuthContext

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showForm, setShowForm] = useState(true);

    const { setAccessToken, setRefreshToken } = useContext(AuthContext);

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
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
    
                toast.success('Login successful', {
                    position: "top-right",
                    autoClose: 5000
                });
                setUsername(''); // Clear the username field
                setPassword(''); // Clear the password field
                setShowForm(false); // Close the component
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
        <div className="fixed z-10 inset-0 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-custom h-custom" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white px-1 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <button 
                            onClick={() => setShowForm(false)} 
                            className="absolute right-0 top-0 m-2 border-2 hover:border-red-400 text-black font-bold py-0 px-2 rounded"
                        >
                            X
                        </button>
                        <h2 className="text-2xl font-bold mb-3 mr-4  text-center">Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Username:</label>
                                <input
                                    type="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                />
                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>
                            <button 
                                type="submit" 
                                className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;