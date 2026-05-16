import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AddTransaction from '../components/AddTransaction';
import { AuthContext } from '../context/AuthContext';

export default function GroupView() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [group, setGroup] = useState(null);
    const [categories, setCategories] = useState([]);

    const [filterType, setFilterType] = useState('all');
    const [filterUser, setFilterUser] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', amount: '', category_id: '' });

    const [visibleCount, setVisibleCount] = useState(10);

    const fetchGroupData = async () => {
        try {
            const response = await api.get(`/groups/${id}`);
            setGroup(response.data);
            
            const catResponse = await api.get(`/categories?group_id=${id}`);
            setCategories(catResponse.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const handleDelete = async (transactionId) => {
        if (!confirm("Biztosan törlöd ezt a tételt?")) return;
        try {
            await api.delete(`/transactions/${transactionId}`);
            fetchGroupData();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (t) => {
        setEditingId(t.id);
        setEditFormData({ title: t.title, amount: t.amount, category_id: t.category_id });
    };

    const handleUpdate = async (e, transactionId) => {
        e.preventDefault();
        try {
            await api.put(`/transactions/${transactionId}`, editFormData);
            setEditingId(null);
            fetchGroupData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm("Biztosan eltávolítod ezt a tagot a csoportból?")) return;
        try {
            await api.delete(`/groups/${group.id}/members/${userId}`);
            fetchGroupData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Hiba a tag eltávolításakor");
        }
    };

    if (!group) return <div>Betöltés...</div>;

    const totalIncome = group.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, current) => sum + current.amount, 0);

    const totalExpense = group.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, current) => sum + current.amount, 0);

    const balance = totalIncome - totalExpense;

    const filteredTransactions = group.transactions
        .filter(t => {
            if (filterType !== 'all' && t.type !== filterType) return false;
            if (filterUser !== 'all' && String(t.user_id) !== String(filterUser)) return false;
            if (filterCategory !== 'all' && String(t.category_id) !== String(filterCategory)) return false;
            return true;
        })
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    const paginatedTransactions = filteredTransactions.slice(0, visibleCount);

    return (
        <div>
            <Link to="/">← Vissza a Dashboardra</Link>
            
            <h1>{group.name}</h1>
            <p>Csatlakozási kód: <strong>{group.join_code}</strong></p>

            <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
                <h3>Csoport tagjai</h3>
                <ul style={{ paddingLeft: '20px' }}>
                    {group.users.map(u => (
                        <li key={u.id}>
                            {u.name} {group.creator_id === u.id && '(Alapító)'}
                            {group.creator_id === user?.id && group.creator_id !== u.id && (
                                <button 
                                    onClick={() => handleRemoveMember(u.id)} 
                                    style={{ marginLeft: '10px', color: 'red' }}
                                >
                                    Kirúgás
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', background: '#e6ffe6' }}>
                    <strong>Bevételek:</strong> +{totalIncome} Ft
                </div>
                <div style={{ padding: '10px', background: '#ffe6e6' }}>
                    <strong>Kiadások:</strong> -{totalExpense} Ft
                </div>
                <div style={{ padding: '10px', background: '#e6f7ff' }}>
                    <strong>Egyenleg:</strong> {balance} Ft
                </div>
            </div>

            <AddTransaction groupId={group.id} onTransactionAdded={fetchGroupData} />

            <h2>Szűrés</h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
                <div>
                    <label>Típus: </label>
                    <select value={filterType} onChange={(e) => {setFilterType(e.target.value); setVisibleCount(10);}}>
                        <option value="all">Mind</option>
                        <option value="expense">Kiadás</option>
                        <option value="income">Bevétel</option>
                    </select>
                </div>

                <div>
                    <label>Tag: </label>
                    <select value={filterUser} onChange={(e) => {setFilterUser(e.target.value); setVisibleCount(10);}}>
                        <option value="all">Mindenki</option>
                        {group.users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Kategória: </label>
                    <select value={filterCategory} onChange={(e) => {setFilterCategory(e.target.value); setVisibleCount(10);}}>
                        <option value="all">Mind</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <h2>Tranzakciók</h2>
            {paginatedTransactions.length === 0 ? (
                <p>Nincs a szűrésnek megfelelő rögzített költés.</p>
            ) : (
                <>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {paginatedTransactions.map(t => (
                            <li key={t.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                {/* Szerkesztő űrlap vagy adatmegjelenítés... (Változatlan maradt) */}
                                {editingId === t.id ? (
                                    <form onSubmit={(e) => handleUpdate(e, t.id)}>
                                        <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} required />
                                        <input type="number" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} required min="1" />
                                        <select value={editFormData.category_id} onChange={(e) => setEditFormData({...editFormData, category_id: e.target.value})} required>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        <button type="submit">Mentés</button>
                                        <button type="button" onClick={() => setEditingId(null)}>Mégse</button>
                                    </form>
                                ) : (
                                    <div style={{ color: t.type === 'expense' ? 'red' : 'green' }}>
                                        <strong>{t.title}</strong> - {t.amount} Ft <br/>
                                        <small>{t.transaction_date} | Kategória: {t.category?.name} | Rögzítette: {t.user?.name}</small>
                                        {t.user_id === user?.id && (
                                            <div style={{ marginTop: '5px' }}>
                                                <button onClick={() => startEdit(t)}>Szerkesztés</button>
                                                <button onClick={() => handleDelete(t.id)}>Törlés</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    {/* LAPOZÁS GOMB */}
                    {visibleCount < filteredTransactions.length && (
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            style={{ display: 'block', width: '100%', padding: '10px', marginTop: '10px', background: '#e0e0e0', border: 'none', cursor: 'pointer' }}
                        >
                            Mutass még (még {filteredTransactions.length - visibleCount} db)
                        </button>
                    )}
                </>
            )}
        </div>
    );
}