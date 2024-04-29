import React, { createContext, useState } from 'react';

// Define the initial state of the context
interface AuthContextState {
    isAuthenticated: boolean;
    user: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: (accessToken: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    login: (username: string, password: string) => void;
    logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    setAccessToken: () => {},
    setRefreshToken: () => {},
    login: () => {},
    logout: () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const login = (username: string, password: string) => {
        // Perform authentication logic, e.g. making API calls
        // Set the authenticated user and update the state
        setIsAuthenticated(true);
        setUser(username);
        // setAccessToken and setRefreshToken should be called after successful API call
    };

    const logout = () => {
        // Perform logout logic, e.g. clearing session data
        // Set the authenticated user to null and update the state
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
    };

    const authContextValue: AuthContextState = {
        isAuthenticated,
        user,
        accessToken,
        refreshToken,
        setAccessToken,
        setRefreshToken,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};