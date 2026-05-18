import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AddTransaction({ groupId, onTransactionAdded }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [formData, setFormData] = useState({
        category_id: '',
        type: 'expense',
        amount: '',
        title: '',
        note: '',
        transaction_date: new Date().toISOString().split('T')[0]
    });

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories?group_id=${groupId}`);
            setCategories(response.data);
            if (response.data.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: response.data[0].id }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [groupId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', { ...formData, group_id: groupId });
            setFormData(prev => ({ ...prev, amount: '', title: '', note: '' }));
            onTransactionAdded();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            const response = await api.post('/categories', { name: newCategory, group_id: groupId });
            setCategories([...categories, response.data]);
            setFormData(prev => ({ ...prev, category_id: response.data.id }));
            setNewCategory('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Új tétel rögzítése</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Típus</label>
                            <select 
                                value={formData.type} 
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="expense">Kiadás</option>
                                <option value="income">Bevétel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Kategória</label>
                            <select 
                                value={formData.category_id} 
                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Összeg (Ft)</label>
                            <input 
                                type="number" 
                                value={formData.amount} 
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                required 
                                min="1"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cím / Megjegyzés</label>
                            <input 
                                type="text" 
                                placeholder="Pl. Bevásárlás"
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required 
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dátum</label>
                            <input 
                                type="date" 
                                value={formData.transaction_date} 
                                onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                                required 
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                        >
                            Tétel hozzáadása
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Kategória bővítése</h3>
                <form onSubmit={handleAddCategory} className="flex flex-col h-full">
                    <p className="text-sm text-slate-500 mb-4">Ha hiányzik egy kategória, itt gyorsan hozzáadhatod a csoporthoz.</p>
                    <input 
                        type="text" 
                        placeholder="Pl. Kisállat" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none mb-4"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Létrehozás
                    </button>
                </form>
            </div>
        </div>
    );
}