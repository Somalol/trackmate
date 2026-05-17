import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import CreateGroup from '../components/CreateGroup';
import JoinGroup from '../components/JoinGroup';

export default function Dashboard() {
    const { logout, user, updateUser } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    
    // A fájlfeltöltéshez
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

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

    const handleProfilePictureChange = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profile_picture', selectedFile);

        try {
            const response = await api.post('/profile-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(response.data.user);
            setSelectedFile(null);
            fileInputRef.current.value = ""; 
        } catch (error) {
            console.error(error);
            alert("Hiba a kép feltöltésekor!");
        }
    };

    // Összerakjuk a kép teljes URL-jét
    const profilePicUrl = user?.profile_picture 
        ? `http://127.0.0.1:8000/storage/${user.profile_picture}` 
        : 'https://via.placeholder.com/50';

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <img 
                    src={profilePicUrl} 
                    alt="Profil" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <h1>Üdvözlünk, {user?.name}!</h1>
                <button onClick={logout}>Kijelentkezés</button>
            </div>

            <div style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ddd' }}>
                <h4>Profilkép cseréje</h4>
                <form onSubmit={handleProfilePictureChange} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <button type="submit" disabled={!selectedFile}>Feltöltés</button>
                </form>
            </div>

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