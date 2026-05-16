import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_Confirmation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        register({ name, email, password, password_confirmation });
    };

    return (
        <div>
            <h1>Regisztráció a TrackMate-be</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Név'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <input 
                    type="password" 
                    placeholder="Jelszó újra" 
                    value={password_confirmation} 
                    onChange={(e) => setPassword_Confirmation(e.target.value)} 
                />
                <button type="submit">Regisztrálok</button>
            </form>
        </div>
    );
}