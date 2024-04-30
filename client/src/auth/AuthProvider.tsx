import React, { useState } from 'react';
import { AuthContext, SignInCredentials, User } from './Context'; // replace with the actual path to your AuthContext
import api from '../api';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingUserData, setLoadingUserData] = useState(false);

    const logIn = async (credentials: SignInCredentials) => {
        setLoadingUserData(true);
        try {
            // Call your API to log in the user
            const response = await api.post('/login', credentials);
            setUser({
                username: response.data.username,
                user_id: response.data.user_id,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                roles: response.data.roles
            });
            setIsAuthenticated(true);
            console.log('User logged in:', response.data);

             // Store the access_token and refresh_token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user_id', response.data.user_id);
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            setLoadingUserData(false);
        }
    };

    const signOut = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            loadingUserData, 
            logIn, 
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;