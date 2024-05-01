import React, { useState } from 'react';
import passwordValidator from 'password-validator';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const navigate = useNavigate();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Password validation
        const schema = new passwordValidator();
        schema
            .is().min(8)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().not().spaces();

        const isValidPassword = schema.validate(password);
        if (!isValidPassword) {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and no spaces');
            return;
        }

        
        try {
            const response = await api.post('/signup', { username, password });
    
            if (response.status === 200) {
                toast.success('Signup successful', {
                    position: "top-right",
                    autoClose: 5000
                });
                setUsername(''); // Clear the username field
                setPassword(''); // Clear the password field
                navigate('/login');

            } else {
                toast.error('Signup failed', {
                    position: "top-right",
                    autoClose: 5000
                });
              
                 
            }
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.detail || 'An error occurred while signing up';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });
          
        }
    };

    return (
        <div className="min-h-20vh flex justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-md w-full space-y-1 ">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-5 ">Sign up</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="rounded-md shadow-sm -space-y-px ">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input 
                                id="username" 
                                name="username" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Password" 
                                value={password} 
                                onChange={handlePasswordChange}
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue  overflow-hidden"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;