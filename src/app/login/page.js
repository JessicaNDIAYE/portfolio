'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Erreur de connexion :', error.message);
      alert("Identifiants incorrects ou problème de connexion.");
    } else {
      router.push('/admin');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(rgba(200, 230, 255, 0.3), rgba(220, 240, 255, 0.3)), url(/grid-bg.svg)',
        backgroundSize: '100px 100px',
        backgroundColor: '#f0f9ff',
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Connexion
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Votre email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Votre mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg border border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-sm"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
