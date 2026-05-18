import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AddTransaction from '../components/AddTransaction';
import TodoManager from '../components/TodoManager';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

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
    const [activeTab, setActiveTab] = useState('finance'); 

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

    useEffect(() => { fetchGroupData(); }, [id]);

    const handleDelete = async (tId) => {
        if (!confirm("Törlöd?")) return;
        try { await api.delete(`/transactions/${tId}`); fetchGroupData(); } catch (e) { console.error(e); }
    };

    const handleUpdate = async (e, tId) => {
        e.preventDefault();
        try { await api.put(`/transactions/${tId}`, editFormData); setEditingId(null); fetchGroupData(); } catch (err) { console.error(err); }
    };

    const handleRemoveMember = async (uId) => {
        if (!confirm("Eltávolítod a tagot?")) return;
        try { await api.delete(`/groups/${group.id}/members/${uId}`); fetchGroupData(); } catch (e) { console.error(e); }
    };

    if (!group) return <LoadingSpinner />;

    const totalIncome = group.transactions.filter(t => t.type === 'income').reduce((s, c) => s + c.amount, 0);
    const totalExpense = group.transactions.filter(t => t.type === 'expense').reduce((s, c) => s + c.amount, 0);
    const balance = totalIncome - totalExpense;

    const filteredTransactions = group.transactions
        .filter(t => {
            if (filterType !== 'all' && t.type !== filterType) return false;
            if (filterUser !== 'all' && String(t.user_id) !== String(filterUser)) return false;
            if (filterCategory !== 'all' && String(t.category_id) !== String(filterCategory)) return false;
            return true;
        })
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
            <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* BAL OLDAL: Feltűnő Vissza gomb és Cím */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link 
                            to="/" 
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm group"
                            title="Vissza a Dashboardra"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2.5} 
                                stroke="currentColor" 
                                className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                            {group.name}
                        </h1>
                    </div>

                    {/* JOBB OLDAL: Kiemelt Kód és Témaváltó */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />
                        <div className="flex flex-col sm:flex-row sm:items-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase font-bold leading-none mb-0.5 sm:mb-0 sm:mr-2">Kód:</span>
                            <span className="text-sm font-mono font-black text-emerald-700 dark:text-emerald-400 leading-none">{group.join_code}</span>
                        </div>
                    </div>

                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Összes bevétel</p>
                        <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">+{totalIncome.toLocaleString()} Ft</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-rose-500">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Összes kiadás</p>
                        <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400">-{totalExpense.toLocaleString()} Ft</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Aktuális egyenleg</p>
                        <h2 className={`text-2xl font-black ${balance >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600'}`}>{balance.toLocaleString()} Ft</h2>
                    </div>
                </div>

                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('finance')}
                        className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'finance' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
                    >
                        💰 Pénzügyek
                    </button>
                    <button 
                        onClick={() => setActiveTab('todos')}
                        className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'todos' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
                    >
                        📝 Teendők
                    </button>
                    <button 
                        onClick={() => setActiveTab('members')}
                        className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'members' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
                    >
                        👥 Tagok
                    </button>
                </div>

                {activeTab === 'finance' && (
                    <>
                        <AddTransaction groupId={group.id} onTransactionAdded={fetchGroupData} />
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
                                <h3 className="font-bold flex-grow dark:text-white">Tranzakciók</h3>
                                <div className="flex gap-2">
                                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-xs p-1.5 rounded bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
                                        <option value="all">Minden típus</option>
                                        <option value="expense">Kiadás</option>
                                        <option value="income">Bevétel</option>
                                    </select>
                                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="text-xs p-1.5 rounded bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
                                        <option value="all">Mindenki</option>
                                        {group.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredTransactions.slice(0, visibleCount).map(t => (
                                    <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        {editingId === t.id ? (
                                            <form onSubmit={(e) => handleUpdate(e, t.id)} className="flex flex-wrap gap-2">
                                                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="p-1 text-sm rounded border dark:bg-slate-900 dark:text-white" />
                                                <input type="number" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} className="p-1 text-sm rounded border dark:bg-slate-900 dark:text-white" />
                                                <button type="submit" className="bg-emerald-600 text-white px-2 py-1 rounded text-xs">Mentés</button>
                                                <button type="button" onClick={() => setEditingId(null)} className="text-xs">Mégse</button>
                                            </form>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                        {t.type === 'income' ? '+' : '-'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{t.title}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.transaction_date} • {t.category?.name} • {t.user?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} Ft
                                                    </p>
                                                    {t.user_id === user?.id && (
                                                        <div className="flex gap-2 justify-end mt-1">
                                                            <button onClick={() => { setEditingId(t.id); setEditFormData({title: t.title, amount: t.amount, category_id: t.category_id}); }} className="text-[10px] text-blue-500">Szerkesztés</button>
                                                            <button onClick={() => handleDelete(t.id)} className="text-[10px] text-red-500">Törlés</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {visibleCount < filteredTransactions.length && (
                                <button onClick={() => setVisibleCount(v => v + 10)} className="w-full py-4 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50/50 dark:bg-slate-900/50">TÖBB BETÖLTÉSE</button>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'todos' && <TodoManager groupId={group.id} groupUsers={group.users} />}

                {activeTab === 'members' && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Csoport tagjai</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.users.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">{u.name}</p>
                                                <p className="text-[10px] text-slate-400">{group.creator_id === u.id ? 'Tulajdonos' : 'Tag'}</p>
                                            </div>
                                        </div>
                                        {group.creator_id === user?.id && group.creator_id !== u.id && (
                                            <button onClick={() => handleRemoveMember(u.id)} className="text-xs text-red-500 hover:font-bold transition-all">Eltávolítás</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}