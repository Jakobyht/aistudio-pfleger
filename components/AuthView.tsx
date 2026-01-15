
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { COLORS } from '../constants';

interface AuthViewProps {
  onLogin: (skipped: boolean) => void;
}

const AuthView: React.FC<AuthViewProps> = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-white">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F26A8D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">NurseMatch</h1>
        <p className="mt-1 text-white/80 font-medium">Familiar. Trustworthy. Human.</p>
      </div>

      <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
        <div>
          <input 
            type="email" 
            placeholder="E-Mail" 
            className="w-full p-4 bg-white text-black rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Passwort" 
            className="w-full p-4 bg-white text-black rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-xs text-red-200 bg-red-500/20 p-2 rounded-lg">{error}</p>}

        <button 
          type="submit"
          className="w-full py-4 bg-white text-pink-600 rounded-full font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
        >
          {isLogin ? 'Anmelden' : 'Registrieren'}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-sm font-bold text-white/80 hover:text-white underline underline-offset-4"
      >
        {isLogin ? 'Noch kein Konto? Registrieren' : 'Bereits ein Konto? Anmelden'}
      </button>

      <p className="mt-8 text-[10px] text-center text-white/40 px-4 uppercase tracking-widest font-bold">
        NurseMatch Security Protocol v1.0
      </p>
    </div>
  );
};

export default AuthView;
