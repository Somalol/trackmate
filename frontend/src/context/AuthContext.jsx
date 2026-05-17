import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Létrehozzuk a Contextet
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('trackmate_token') || null);

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
    };
    
    const navigate = useNavigate();

    const login = async (formData) => {
        try {
            const response = await api.post('/login', formData);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('trackmate_token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error("Belépési hiba:", error.response?.data?.message);
            alert("Hibás e-mail vagy jelszó!");
        }
    };


    const register = async (formData) => {
        try {
            const response = await api.post('/register', formData);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('trackmate_token', response.data.token);
            navigate('/'); 
        } catch (error) {
            console.error("Regisztrációs hiba:", error.response?.data);
            alert("Hiba történt a regisztráció során.");
        }
    };


    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Hiba a szerver oldali kijelentkezésnél", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('trackmate_token');
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};