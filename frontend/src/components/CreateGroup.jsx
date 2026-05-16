import { useState } from 'react';
import api from '../api/axios';

export default function CreateGroup({ onGroupCreated }) {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/groups', { name });
            setName('');
            onGroupCreated();
        } catch (error) {
            console.error(error);
            alert("Hiba a csoport létrehozásakor");
        }
    };

    return (
        <div>
            <h2>Új csoport létrehozása</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Csoport neve" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <button type="submit">Létrehozás</button>
            </form>
        </div>
    );
}