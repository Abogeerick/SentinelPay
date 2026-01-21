import React, { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';

interface RealtimeMetric {
    label: string;
    value: number | string;
    previousValue?: number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: 'green' | 'red' | 'blue' | 'yellow' | 'purple';
}

interface RealtimeIndicatorProps {
    metrics: RealtimeMetric[];
    updateInterval?: number;
    onUpdate?: () => void;
    showConnectionStatus?: boolean;
    className?: string;
}

/**
 * Real-Time Indicator Component
 * 
 * Displays live updating metrics with connection status and trend indicators.
 * Perfect for dashboards requiring live data visualization.
 * 
 * Features:
 * - Connection status indicator
 * - Trend arrows with animations
 * - Customizable update intervals
 * - Pulse animation on updates
 * 
 * @example
 * <RealtimeIndicator
 *   metrics={[
 *     { label: 'Active Users', value: 1234, trend: 'up', color: 'green' },
 *     { label: 'Transactions/s', value: 45, trend: 'stable', color: 'blue' }
 *   ]}
 *   updateInterval={5000}
 * />
 */
const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({
    metrics,
    updateInterval = 5000,
    onUpdate,
    showConnectionStatus = true,
    className,
}) => {
    const [isConnected, setIsConnected] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [isPulsing, setIsPulsing] = useState(false);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(Date.now());
            setIsPulsing(true);
            onUpdate?.();

            // Reset pulse animation
            setTimeout(() => setIsPulsing(false), 500);
        }, updateInterval);

        // Simulate connection status changes (for demo)
        const connectionCheck = setInterval(() => {
            setIsConnected(Math.random() > 0.05); // 95% uptime simulation
        }, 10000);

        return () => {
            clearInterval(interval);
            clearInterval(connectionCheck);
        };
    }, [updateInterval, onUpdate]);

    const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-emerald-500" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            default:
                return <Minus className="w-4 h-4 text-slate-400" />;
        }
    };

    const getColorClasses = (color?: string) => {
        switch (color) {
            case 'green':
                return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            case 'red':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'blue':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'yellow':
                return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'purple':
                return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
            default:
                return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        }
    };

    const formatTime = useCallback((timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 5) return 'just now';
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    }, []);

    return (
        <div className={clsx('space-y-4', className)}>
            {/* Connection Status Bar */}
            {showConnectionStatus && (
                <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <div className="relative">
                                    <Wifi className="w-4 h-4 text-emerald-500" />
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                </div>
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    Live
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    Disconnected
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Activity className={clsx('w-3 h-3', isPulsing && 'animate-ping')} />
                        <span>Updated {formatTime(lastUpdate)}</span>
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={clsx(
                            'p-4 rounded-xl border transition-all duration-300',
                            getColorClasses(metric.color),
                            isPulsing && 'scale-[1.02] shadow-lg'
                        )}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {metric.label}
                            </span>
                            {getTrendIcon(metric.trend)}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {typeof metric.value === 'number'
                                    ? metric.value.toLocaleString()
                                    : metric.value}
                            </span>
                            {metric.unit && (
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {metric.unit}
                                </span>
                            )}
                        </div>
                        {metric.previousValue !== undefined && (
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                was {metric.previousValue.toLocaleString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RealtimeIndicator;
