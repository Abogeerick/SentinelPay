import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/Button';
import { ShieldAlert } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fintech-400/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse-slow [animation-delay:1s]"></div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl dark:shadow-fintech-900/20 w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up z-10">
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-fintech-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-fintech-600/40">
                <ShieldAlert className="text-white w-9 h-9" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your SentinelPay dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <input 
                    type="email" 
                    defaultValue="demo@user.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all dark:text-white"
                />
            </div>
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <input 
                    type="password" 
                    defaultValue="password"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-fintech-500 focus:border-transparent focus:outline-none transition-all dark:text-white"
                />
            </div>
            
            <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-fintech-600/20" isLoading={isLoading}>
                Sign In
            </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
            <p>Demo Mode: Click "Sign In" to continue</p>
        </div>
      </div>
    </div>
  );
};

export default Login;