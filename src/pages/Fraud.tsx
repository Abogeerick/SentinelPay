import React, { useEffect } from 'react';
import { useFraudStore } from '../stores/fraudStore';
import { useThemeStore } from '../stores/themeStore';
import Card from '../components/Card';
import RiskGauge from '../components/RiskGauge';
import Button from '../components/Button';
import { AlertTriangle, MapPin, Monitor, Globe, BrainCircuit } from 'lucide-react';
import { Tooltip, ResponsiveContainer, Treemap } from 'recharts';

const Fraud: React.FC = () => {
  const { alerts, riskScore, device, explanation, loadFraudData, explainRisk, isLoading } = useFraudStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    loadFraudData();
  }, [loadFraudData]);

  const treeData = [
    { name: 'US-East', size: 100, fill: '#10b981' }, 
    { name: 'EU-West', size: 50, fill: '#10b981' },
    { name: 'Unknown', size: 30, fill: '#ef4444' },
    { name: 'Proxy', size: 20, fill: '#f59e0b' },
    { name: 'Mobile', size: 80, fill: '#3b82f6' },
    { name: 'Desktop', size: 40, fill: '#6366f1' },
  ];

  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    color: isDarkMode ? '#f8fafc' : '#1e293b',
    borderRadius: '8px',
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pt-16 md:pt-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-slide-up">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fraud Protection</h1>
            <p className="text-slate-500 dark:text-slate-400">Real-time risk monitoring and threat detection.</p>
        </div>
        {riskScore && (
             <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 animate-slide-in-right ${
                 riskScore.score > 50 
                 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400' 
                 : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
             }`}>
                 <span className="font-bold">Risk Level: {riskScore.level.toUpperCase()}</span>
             </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="animate-slide-up [animation-delay:100ms]">
            <Card title="Current Risk Score" className="flex flex-col items-center justify-center p-4 h-full">
                {riskScore && <RiskGauge risk={riskScore} />}
            </Card>
          </div>

          {/* Device Fingerprint */}
          <div className="md:col-span-2 animate-slide-up [animation-delay:200ms]">
            <Card title="Device Fingerprint">
                {device && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center text-center transition-colors">
                            <Monitor className="text-fintech-500 mb-2" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Model</span>
                            <span className="font-medium text-slate-900 dark:text-white">{device.model}</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center text-center transition-colors">
                            <Globe className="text-fintech-500 mb-2" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">IP Address</span>
                            <span className="font-medium text-slate-900 dark:text-white">{device.ip}</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center text-center transition-colors">
                            <MapPin className="text-fintech-500 mb-2" />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">Device ID</span>
                            <span className="font-medium text-slate-900 dark:text-white truncate w-full">{device.deviceId}</span>
                        </div>
                    </div>
                )}
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <BrainCircuit className="text-indigo-500" size={18} />
                                AI Risk Analysis
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get an explanation for your current score.</p>
                        </div>
                        <Button onClick={explainRisk} isLoading={isLoading} variant="secondary">
                            Explain Risk
                        </Button>
                    </div>
                    {explanation && (
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 rounded-xl text-sm border border-indigo-100 dark:border-indigo-800 animate-fade-in">
                            {explanation}
                        </div>
                    )}
                </div>
            </Card>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts List */}
          <div className="animate-slide-up [animation-delay:300ms]">
            <Card title="Security Alerts" className="h-full">
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div key={alert.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <div className={`mt-1 p-2 rounded-full h-fit ${alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                                <AlertTriangle size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.message}</p>
                                <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className={alert.resolved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400 font-medium'}>
                                        {alert.resolved ? 'Resolved' : 'Action Required'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {alerts.length === 0 && <p className="text-slate-400 text-center">No active alerts.</p>}
                </div>
            </Card>
          </div>

          {/* Risk Heatmap */}
          <div className="animate-slide-up [animation-delay:400ms]">
            <Card title="Traffic Risk Heatmap" className="h-full">
                <div className="h-[300px] w-full rounded-lg overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={treeData}
                            dataKey="size"
                            aspectRatio={4 / 3}
                            stroke={isDarkMode ? '#0f172a' : '#fff'}
                        >
                            <Tooltip contentStyle={tooltipStyle} />
                        </Treemap>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 text-center mt-3">Visual representation of traffic sources by risk volume.</p>
            </Card>
          </div>
      </div>
    </div>
  );
};

export default Fraud;