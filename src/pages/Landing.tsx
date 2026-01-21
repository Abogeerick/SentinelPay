import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Github,
  ExternalLink
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Real-Time Fraud Detection',
      description: 'AI-powered risk scoring with 7 detection rules analyzing every transaction in real-time.'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Process transactions in under 50ms with our optimized payment infrastructure.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'JWT authentication, BCrypt encryption, and comprehensive audit logging.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with real-time insights and transaction monitoring.'
    }
  ];

  const capabilities = [
    'Multi-rule fraud detection engine',
    'Device fingerprinting',
    'IP-based risk analysis',
    'Behavioral pattern detection',
    'Real-time transaction monitoring',
    'Automated risk scoring (0-100)'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-semibold tracking-tight">SentinelPay</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Abogeerick/SentinelPay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              to="/login"
              className="px-5 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm text-slate-300 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span>Production-Ready Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Fraud detection that
            <br />
            <span className="text-slate-400">actually works.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enterprise-grade payment protection with real-time risk scoring.
            Built with Clean Architecture and deployed for scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://sentinelpay.onrender.com/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              <span>API Documentation</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800/50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<50ms', label: 'Latency' },
              { value: '7', label: 'Detection Rules' },
              { value: '0-100', label: 'Risk Score' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for serious applications</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to protect transactions and prevent fraud at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Comprehensive fraud prevention</h2>
              <p className="text-slate-400 mb-8">
                Our multi-layered approach combines rule-based detection with behavioral analysis
                to identify threats before they impact your business.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <div className="text-xs font-mono text-slate-500 mb-4">Risk Assessment Response</div>
              <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                {`{
  "transactionId": "tx_8f2kd9s",
  "riskScore": 23,
  "riskLevel": "safe",
  "triggeredRules": [],
  "processingTime": "12ms",
  "recommendation": "approve"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Modern technology stack</h2>
          <p className="text-slate-400 mb-12">Built with proven technologies for reliability and performance.</p>

          <div className="flex flex-wrap justify-center gap-4">
            {['.NET 8', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'].map((tech, index) => (
              <div
                key={index}
                className="px-5 py-2.5 bg-slate-900/50 border border-slate-800/50 rounded-lg text-sm text-slate-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">
            Sign in with demo credentials to explore the full platform.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-900" />
              </div>
              <span className="font-semibold">SentinelPay</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a
                href="https://sentinelpay.onrender.com/swagger"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                API Docs
              </a>
              <a
                href="https://github.com/Abogeerick/SentinelPay"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                GitHub
              </a>
              <Link to="/login" className="hover:text-slate-300 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm text-slate-600">
            © 2025 SentinelPay. Built for modern fintech.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
