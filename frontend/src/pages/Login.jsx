import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div>
            <h1>Belépés a TrackMate-be</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Jelszó" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Belépés</button>
            </form>
        </div>
    );
}