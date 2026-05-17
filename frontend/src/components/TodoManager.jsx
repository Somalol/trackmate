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
            await api.put(`/todo-items/${item.id}`, {
                is_completed: !item.is_completed
            });
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
        <div>
            <h3>Teendők és Bevásárlólisták</h3>

            <form onSubmit={handleCreateList} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Új lista neve (pl. Bevásárlás)"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                />
                <button type="submit">Lista létrehozása</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {lists.map(list => (
                    <div key={list.id} style={{ border: '1px solid #ddd', padding: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>{list.name}</h4>
                            <button onClick={() => handleDeleteList(list.id)} style={{ color: 'red' }}>Lista törlése</button>
                        </div>

                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {list.items.map(item => (
                                <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <input
                                        type="checkbox"
                                        checked={item.is_completed}
                                        onChange={() => handleToggleTask(item)}
                                    />
                                    <span style={{ textDecoration: item.is_completed ? 'line-through' : 'none', flexGrow: 1 }}>
                                        {item.task}
                                    </span>
                                    {item.assignee && (
                                        <small style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' }}>
                                            👤 {item.assignee.name}
                                        </small>
                                    )}
                                    <button onClick={() => handleDeleteTask(item.id)} style={{ padding: '2px 5px', fontSize: '12px' }}>Törlés</button>
                                </li>
                            ))}
                        </ul>

                        <form onSubmit={(e) => handleCreateTask(e, list.id)} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input
                                type="text"
                                placeholder="Új feladat..."
                                value={newTaskInputs[list.id] || ''}
                                onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [list.id]: e.target.value }))}
                            />
                            <select
                                value={newTaskAssignees[list.id] || ''}
                                onChange={(e) => setNewTaskAssignees(prev => ({ ...prev, [list.id]: e.target.value }))}
                            >
                                <option value="">Bárki csinálhatja</option>
                                {groupUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            <button type="submit">Hozzáadás</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}