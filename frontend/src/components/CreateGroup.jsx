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
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Új csoport létrehozása</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-auto">
                <input 
                    type="text" 
                    placeholder="Csoport neve" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                    Létrehozás
                </button>
            </form>
        </div>
    );
}