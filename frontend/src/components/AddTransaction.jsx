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
            alert("Hiba a tranzakció rögzítésekor!");
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
            alert("Hiba a kategória létrehozásakor!");
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>Új tétel rögzítése</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Típus: </label>
                    <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                        <option value="expense">Kiadás</option>
                        <option value="income">Bevétel</option>
                    </select>
                </div>
                
                <div>
                    <label>Kategória: </label>
                    <select 
                        value={formData.category_id} 
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        required
                    >
                        <option value="" disabled>Válassz...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <input 
                        type="number" 
                        placeholder="Összeg (Ft)" 
                        value={formData.amount} 
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required 
                        min="1"
                    />
                </div>

                <div>
                    <input 
                        type="text" 
                        placeholder="Cím" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required 
                    />
                </div>

                <div>
                    <input 
                        type="date" 
                        value={formData.transaction_date} 
                        onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                        required 
                    />
                </div>

                <div>
                    <button type="submit">Hozzáadás</button>
                </div>
            </form>

            <hr />
            <h4>Új saját kategória hozzáadása</h4>
            <form onSubmit={handleAddCategory}>
                <input 
                    type="text" 
                    placeholder="Kategória neve" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                />
                <button type="submit">Kategória létrehozása</button>
            </form>
        </div>
    );
}