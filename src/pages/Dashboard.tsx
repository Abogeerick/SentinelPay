import React, { useEffect } from 'react';
import { useWalletStore } from '../stores/walletStore';
import { useFraudStore } from '../stores/fraudStore';
import { useThemeStore } from '../stores/themeStore';
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import RiskGauge from '../components/RiskGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { balance, transactions, loadBalance, loadTransactions } = useWalletStore();
  const { riskScore, alerts, loadFraudData } = useFraudStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadFraudData();
  }, [loadBalance, loadTransactions, loadFraudData]);

  const chartData = [
    { name: 'Mon', income: 400, spend: 240 },
    { name: 'Tue', income: 300, spend: 139 },
    { name: 'Wed', income: 200, spend: 980 },
    { name: 'Thu', income: 278, spend: 390 },
    { name: 'Fri', income: 189, spend: 480 },
    { name: 'Sat', income: 239, spend: 380 },
    { name: 'Sun', income: 349, spend: 430 },
  ];

  const axisColor = isDarkMode ? '#64748b' : '#94a3b8';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    color: isDarkMode ? '#f8fafc' : '#1e293b',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pt-16 md:pt-8">
      <header className="mb-6 animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, here's your financial overview.</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-fintech-600 to-fintech-800 rounded-2xl p-6 text-white shadow-lg shadow-fintech-200 dark:shadow-none animate-slide-up [animation-delay:100ms] hover:scale-[1.02] transition-transform">
          <p className="text-fintech-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold mb-4">
            {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </h2>
          <div className="flex gap-4 text-xs font-medium">
             <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <TrendingUp size={14} /> +12.5%
             </div>
             <div className="text-fintech-100 flex items-center">vs last month</div>
          </div>
        </div>

        {/* Risk Score Widget */}
        <div className="animate-slide-up [animation-delay:200ms] h-full">
            <Card title="Security Status" className="h-full">
            <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                {riskScore && <RiskGauge risk={riskScore} />}
                </div>
                <div className="flex-1 pl-4 border-l border-slate-100 dark:border-slate-800">
                    <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <ShieldCheck size={16} className="text-emerald-500"/>
                        <span>Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <AlertTriangle size={16} className="text-amber-500"/>
                        <span>{alerts.length} New Alerts</span>
                    </div>
                    </div>
                </div>
            </div>
            </Card>
        </div>

        {/* Quick Actions / Mini Chart */}
        <div className="animate-slide-up [animation-delay:300ms] h-full">
            <Card title="Activity Trend" className="h-full">
                <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartData}>
                    <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 animate-slide-up [animation-delay:400ms]">
            <Card title="Spending vs Income" className="min-h-[400px]">
            <div className="h-[320px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisColor}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor}} />
                    <Tooltip 
                        cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9', opacity: 0.4}}
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}
                    />
                    <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="spend" fill={isDarkMode ? '#475569' : '#cbd5e1'} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </Card>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 animate-slide-up [animation-delay:500ms]">
            <Card title="Recent Transactions">
            <div className="space-y-1">
                {transactions.slice(0, 5).map(tx => (
                <TransactionItem key={tx.id} transaction={tx} />
                ))}
                {transactions.length === 0 && <p className="text-slate-400 text-center py-8">No transactions yet.</p>}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-fintech-600 dark:text-fintech-400 font-medium hover:bg-fintech-50 dark:hover:bg-fintech-900/20 rounded-lg transition-colors">View All Activity</button>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;