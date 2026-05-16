import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CreateGroup from '../components/CreateGroup';
import JoinGroup from '../components/JoinGroup';

export default function Dashboard() {
    const { logout, user } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div>
            <h1>Üdvözlünk, {user?.name}!</h1>
            <button onClick={logout}>Kijelentkezés</button>

            {/* Itt hívjuk meg a komponenseket, és átadjuk a frissítő függvényt */}
            <CreateGroup onGroupCreated={fetchGroups} />
            <JoinGroup onGroupJoined={fetchGroups} />

            <h2>Csoportjaid</h2>
            {groups.length === 0 ? (
                <p>Még nem vagy tagja egyetlen csoportnak sem.</p>
            ) : (
                <ul>
                    {groups.map(group => (
                        <li key={group.id}>
                            <Link to={`/group/${group.id}`}>
                                {group.name}
                            </Link>
                            (Kód: {group.join_code})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}