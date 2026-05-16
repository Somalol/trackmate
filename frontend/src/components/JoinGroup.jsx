import { useState } from 'react';
import api from '../api/axios';

export default function JoinGroup({ onGroupJoined }) {
    const [joinCode, setJoinCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/groups/join', { join_code: joinCode });
            setJoinCode('');
            onGroupJoined();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Hiba a csatlakozás során");
        }
    };

    return (
        <div>
            <h2>Csatlakozás csoporthoz</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Csatlakozási kód" 
                    value={joinCode} 
                    onChange={(e) => setJoinCode(e.target.value)} 
                />
                <button type="submit">Csatlakozás</button>
            </form>
        </div>
    );
}