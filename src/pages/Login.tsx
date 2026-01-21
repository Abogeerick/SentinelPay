import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithCredentials, register, isLoading, isAuthenticated, error: storeError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@sentinelpay.io');
  const [password, setPassword] = useState('password123');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const error = storeError || localError;

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
    setLocalError('');
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password');
      return;
    }

    await loginWithCredentials(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password');
      return;
    }

    if (isRegistering && !name.trim()) {
      setLocalError('Please enter your name');
      return;
    }

    await register(email, password, name);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-slate-900" />
            </div>
            <span className="text-3xl font-semibold text-white tracking-tight">
              SentinelPay
            </span>
          </div>

          {/* Value Proposition */}
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Secure payments,
            <br />
            <span className="text-slate-400">intelligent protection.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-12">
            Enterprise-grade fraud detection with real-time transaction monitoring.
            Built for modern financial platforms.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-8">
            <div>
              <div className="text-2xl font-semibold text-white">99.9%</div>
              <div className="text-sm text-slate-500">Uptime SLA</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <div className="text-2xl font-semibold text-white">&lt;50ms</div>
              <div className="text-sm text-slate-500">Response Time</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <div className="text-2xl font-semibold text-white">SOC 2</div>
              <div className="text-sm text-slate-500">Compliant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-2xl font-semibold text-white tracking-tight">
              SentinelPay
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isRegistering ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400">
              {isRegistering
                ? 'Start protecting your transactions today'
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3.5 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setLocalError(''); clearError(); }}
              disabled={isLoading}
              className="text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {isRegistering ? (
                <>Already have an account? <span className="text-white font-medium">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-white font-medium">Sign Up</span></>
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Demo Credentials</div>
            <div className="text-sm text-slate-500 space-y-1">
              <p>Email: <span className="text-slate-300">demo@sentinelpay.io</span></p>
              <p>Password: <span className="text-slate-300">password123</span></p>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
