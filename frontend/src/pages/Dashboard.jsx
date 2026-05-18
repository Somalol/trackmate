import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import CreateGroup from '../components/CreateGroup';
import JoinGroup from '../components/JoinGroup';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
    const { logout, user, updateUser } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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

    const profilePicUrl = user?.profile_picture 
        ? user.profile_picture 
        : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`;

    if(isLoading) { return <LoadingSpinner /> }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
            
            <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img 
                            src={profilePicUrl} 
                            alt="Profil" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" 
                        />
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">Üdvözlünk,</p>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white m-0">
                                {user?.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button 
                            onClick={logout}
                            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                        >
                            Kijelentkezés
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Vezérlőpult</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Profilkép cseréje</h3>
                            <form onSubmit={handleProfilePictureChange} className="flex flex-col gap-4 mt-auto">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400 cursor-pointer"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!selectedFile}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                                >
                                    Feltöltés
                                </button>
                            </form>
                        </div>

                        <CreateGroup onGroupCreated={fetchGroups} />
                        
                        <JoinGroup onGroupJoined={fetchGroups} />

                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Csoportjaid</h2>
                    
                    {groups.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl border-dashed">
                            <p className="text-slate-500 dark:text-slate-400">Még nem vagy tagja egyetlen csoportnak sem.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map(group => (
                                <Link 
                                    to={`/group/${group.id}`} 
                                    key={group.id}
                                    className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all p-6 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {group.name}
                                        </h3>
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">
                                            #{group.join_code}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                                        Kattints a megnyitáshoz →
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}