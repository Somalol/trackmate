import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // A tokent a megszokott módon olvassuk be
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    
    // ÚJ: A usert is a localStorage-ból olvassuk be induláskor, ha létezik
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });


    const login = async (credentials) => {
        const response = await api.post('/login', credentials);
        
        const userToken = response.data.token || response.data.access_token; 
        
        const userData = response.data.user;
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        setToken(userToken);
        setUser(userData);
    };

    const register = async (userDataInputs) => {
        const response = await api.post('/register', userDataInputs);
        
        const userToken = response.data.token || response.data.access_token;
        const loggedInUser = response.data.user;
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser)); 
        
        // Itt is azonnal beállítjuk!
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        setToken(userToken);
        setUser(loggedInUser);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Hiba a kijelentkezés során", error);
        } finally {
            // Mindent takarítunk a localStorage-ból is
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        }
    };

    // ÚJ / FRISSÍTETT: Amikor profilképet váltasz, a böngésző memóriáját is frissítjük!
    const updateUser = (updatedUserData) => {
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};