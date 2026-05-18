import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await await login({ 
                email: email, 
                password: password 
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Hiba a bejelentkezéskor!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">TrackMate</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Jelentkezz be a folytatáshoz</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E-mail cím</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            placeholder="pelda@gmail.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Jelszó</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md shadow-emerald-500/30"
                    >
                        Bejelentkezés
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
                    Nincs még fiókod?{' '}
                    <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                        Regisztrálj itt
                    </Link>
                </p>
            </div>
        </div>
    );
}