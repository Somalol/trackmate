import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TodoManager({ groupId, groupUsers }) {
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [newTaskInputs, setNewTaskInputs] = useState({});
    const [newTaskAssignees, setNewTaskAssignees] = useState({});

    const fetchLists = async () => {
        try {
            const response = await api.get(`/todo-lists?group_id=${groupId}`);
            setLists(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, [groupId]);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        try {
            await api.post('/todo-lists', { group_id: groupId, name: newListName });
            setNewListName('');
            fetchLists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteList = async (listId) => {
        if (!confirm("Biztosan törlöd ezt a listát?")) return;
        try {
            await api.delete(`/todo-lists/${listId}`);
            fetchLists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTask = async (e, listId) => {
        e.preventDefault();
        const task = newTaskInputs[listId];
        const assigned_user_id = newTaskAssignees[listId];
        if (!task || !task.trim()) return;
        try {
            await api.post('/todo-items', {
                todo_list_id: listId,
                task: task,
                assigned_user_id: assigned_user_id || null
            });
            setNewTaskInputs(prev => ({ ...prev, [listId]: '' }));
            setNewTaskAssignees(prev => ({ ...prev, [listId]: '' }));
            fetchLists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleTask = async (item) => {
        try {
            await api.put(`/todo-items/${item.id}`, { is_completed: !item.is_completed });
            fetchLists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (itemId) => {
        try {
            await api.delete(`/todo-items/${itemId}`);
            fetchLists();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Új lista létrehozása</h3>
                <form onSubmit={handleCreateList} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Pl. Heti bevásárlás"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="flex-grow px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Létrehozás
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lists.map(list => (
                    <div key={list.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h4 className="font-bold text-slate-800 dark:text-white">{list.name}</h4>
                            <button onClick={() => handleDeleteList(list.id)} className="text-red-500 hover:text-red-700 text-sm">Törlés</button>
                        </div>

                        <div className="p-6 flex-grow">
                            <ul className="space-y-3 mb-6">
                                {list.items.length === 0 && <p className="text-sm text-slate-400 italic">Nincs még feladat ezen a listán.</p>}
                                {list.items.map(item => (
                                    <li key={item.id} className="flex items-center gap-3 group">
                                        <input
                                            type="checkbox"
                                            checked={item.is_completed}
                                            onChange={() => handleToggleTask(item)}
                                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <div className="flex-grow">
                                            <span className={`block text-sm ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {item.task}
                                            </span>
                                            {item.assignee && (
                                                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                                    @{item.assignee.name}
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => handleDeleteTask(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <form onSubmit={(e) => handleCreateTask(e, list.id)} className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-700">
                                <input
                                    type="text"
                                    placeholder="Új teendő..."
                                    value={newTaskInputs[list.id] || ''}
                                    onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [list.id]: e.target.value }))}
                                    className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newTaskAssignees[list.id] || ''}
                                        onChange={(e) => setNewTaskAssignees(prev => ({ ...prev, [list.id]: e.target.value }))}
                                        className="text-xs flex-grow px-2 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="">Senki</option>
                                        {groupUsers.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="bg-emerald-600 text-white px-3 py-1 text-sm rounded-md hover:bg-emerald-700 transition-colors">➕</button>
                                </div>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}