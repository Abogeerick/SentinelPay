import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  TrendingUp, 
  BarChart3, 
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Code,
  Database,
  Cloud,
  Github,
  ExternalLink
} from 'lucide-react';

const Landing: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Real-Time Fraud Detection',
      description: 'Advanced AI-powered fraud detection with multi-rule risk scoring to protect every transaction.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Payments',
      description: 'Process payments instantly with our optimized payment gateway and real-time transaction processing.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'JWT authentication, BCrypt encryption, and device fingerprinting for ultimate security.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with real-time insights, spending patterns, and fraud statistics.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Risk Scoring',
      description: 'Intelligent risk assessment with 7 fraud detection rules and 0-100 risk scoring system.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Beautiful responsive UI that works seamlessly on desktop, tablet, and mobile devices.',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const techStack = [
    { name: '.NET 8', icon: Code, color: 'bg-purple-500' },
    { name: 'React 18', icon: Code, color: 'bg-blue-500' },
    { name: 'PostgreSQL', icon: Database, color: 'bg-indigo-500' },
    { name: 'TypeScript', icon: Code, color: 'bg-blue-600' },
    { name: 'Docker', icon: Cloud, color: 'bg-cyan-500' },
    { name: 'Redis', icon: Database, color: 'bg-red-500' }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Response Time' },
    { value: '7', label: 'Fraud Rules' },
    { value: '100+', label: 'Risk Factors' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
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
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SentinelPay
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Production-Ready Fintech Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Real-Time Fraud Detection
            </span>
            <br />
            <span className="text-white">Meets Payment Gateway</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Built with Clean Architecture, DDD principles, and modern web technologies. 
            Protect your transactions with AI-powered fraud detection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center space-x-2"
            >
              <span>Sign in with demo account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://sentinelpay.onrender.com/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center space-x-2"
            >
              <span>View API Docs</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all animate-slide-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Modern Finance</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to build, secure, and scale your payment platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">It Works</span>
            </h2>
            <p className="text-xl text-gray-400">Simple, secure, and fast</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Login', desc: 'Create your account with secure JWT authentication' },
              { step: '02', title: 'Add Funds', desc: 'Fund your wallet and start making transactions' },
              { step: '03', title: 'Protected Payments', desc: 'Every transaction is analyzed by our fraud detection system' }
            ].map((item, index) => (
              <div
                key={index}
                className="relative p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl animate-slide-up"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built with <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Modern Tech</span>
            </h2>
            <p className="text-xl text-gray-400">Production-ready technology stack</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all text-center animate-slide-up"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-semibold">{tech.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building secure payment platforms with SentinelPay
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">SentinelPay</span>
              </div>
              <p className="text-gray-400">
                Real-time fraud detection and payment gateway platform built with modern technologies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://sentinelpay.onrender.com/swagger" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tech Stack</h3>
              <ul className="space-y-2 text-gray-400">
                <li>.NET 8 + React 18</li>
                <li>PostgreSQL + Redis</li>
                <li>Docker + Vercel</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 pt-8 border-t border-white/10">
            <p>&copy; 2025 SentinelPay. Built with ❤️ for modern fintech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

