import React, { useState ,useEffect,useMemo} from 'react';
import { AuthContext, SignInCredentials, User } from './Context'; 
import api from '../api';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingUserData, setLoadingUserData] = useState(false);
    useEffect(() => {
        // Check the authentication state when the component mounts
        const authState = localStorage.getItem('isAuthenticated');
        if (authState === 'true') {
          // If the user is authenticated, set the isAuthenticated state to true
          setIsAuthenticated(true);
        }
      }, []);
    const logIn = async (credentials: SignInCredentials) => {
        setLoadingUserData(true);
        try {
           
            const response = await api.post('/login', credentials);
            setUser({
                username: response.data.username,
                user_id: response.data.user_id,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                role: response.data.role
            });
            setIsAuthenticated(true);

             // Store the access_token and refresh_token in local storage
          //    localStorage.setItem('user', JSON.stringify({
          //     username: response.data.username,
          //     user_id: response.data.user_id,
          //     access_token: response.data.access_token,
          //     refresh_token: response.data.refresh_token,
          //     role: response.data.role
          // }));
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);

        localStorage.setItem('isAuthenticated', 'true');
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            setLoadingUserData(false);
        }
    };

    const signOut = () => {
        // Clear session
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Clear localStorage
        localStorage.clear();

        // Set user to null and isAuthenticated to false
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = useMemo(() => ({
        user, 
        isAuthenticated, 
        setIsAuthenticated,
        loadingUserData, 
        logIn, 
        signOut 
      }), [user, isAuthenticated, loadingUserData]);
    
      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
};

export default AuthProvider;