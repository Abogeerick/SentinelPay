import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Shield, UserPlus, ArrowRight, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithCredentials, register, isLoading, isAuthenticated, error: storeError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@sentinelpay.io');
  const [password, setPassword] = useState('password123');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Combine store error and local error
  const error = storeError || localError;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to dashboard when authentication succeeds
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Clear errors when switching between login/register
  useEffect(() => {
    setLocalError('');
    clearError();
  }, [isRegistering, clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setLocalError('');
    clearError();

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password');
      return;
    }

    const success = await loginWithCredentials(email, password);
    // Navigation is handled by the useEffect above when isAuthenticated changes
    if (!success) {
      console.log('Login failed, error should be shown from store');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setLocalError('');
    clearError();

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password');
      return;
    }

    if (isRegistering && !name.trim()) {
      setLocalError('Please enter your name');
      return;
    }

    const success = await register(email, password, name);
    // Navigation is handled by the useEffect above when isAuthenticated changes
    if (!success) {
      console.log('Registration failed, error should be shown from store');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.1}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SentinelPay
            </span>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                {isRegistering ? (
                  <UserPlus className="text-white w-10 h-10" />
                ) : (
                  <Shield className="text-white w-10 h-10" />
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-400 text-center">
                {isRegistering
                  ? 'Sign up to start using SentinelPay'
                  : 'Sign in to your SentinelPay dashboard'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
              {isRegistering && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder-gray-500 disabled:opacity-50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@sentinelpay.io"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 focus:outline-none transition-all text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/50 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="ml-2">Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Register/Login */}
            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsRegistering(!isRegistering); setLocalError(''); clearError(); }}
                disabled={isLoading}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isRegistering ? (
                  <>Already have an account? <span className="text-purple-400 font-medium">Sign In</span></>
                ) : (
                  <>Don't have an account? <span className="text-purple-400 font-medium">Sign Up</span></>
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Demo Account</span>
              </div>
              <div className="text-xs text-center text-gray-500 space-y-1">
                <p>Email: demo@sentinelpay.io</p>
                <p>Password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
