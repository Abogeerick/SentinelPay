import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, Info, X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationCenterProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onDismiss: (id: string) => void;
    onClear: () => void;
    maxVisible?: number;
    className?: string;
}

/**
 * Notification Center Component
 * 
 * A comprehensive notification management system with:
 * - Multiple notification types (success, error, warning, info)
 * - Mark as read functionality
 * - Dismissable notifications
 * - Custom actions per notification
 * - Badge counter for unread
 * 
 * Demonstrates senior-level component design with accessibility and UX best practices.
 * 
 * @example
 * <NotificationCenter
 *   notifications={notifications}
 *   onMarkAsRead={handleMarkAsRead}
 *   onMarkAllAsRead={handleMarkAllAsRead}
 *   onDismiss={handleDismiss}
 *   onClear={handleClear}
 * />
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onDismiss,
    onClear,
    maxVisible = 5,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-notification-center]')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    const getTypeConfig = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return {
                    icon: Check,
                    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    borderColor: 'border-l-emerald-500',
                };
            case 'error':
                return {
                    icon: AlertTriangle,
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    iconColor: 'text-red-600 dark:text-red-400',
                    borderColor: 'border-l-red-500',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    borderColor: 'border-l-amber-500',
                };
            case 'info':
            default:
                return {
                    icon: Info,
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    borderColor: 'border-l-blue-500',
                };
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const visibleNotifications = notifications.slice(0, maxVisible);
    const remainingCount = notifications.length - maxVisible;

    return (
        <div className={clsx('relative', className)} data-notification-center>
            {/* Bell Button with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    'relative p-2 rounded-xl transition-all duration-200',
                    'hover:bg-slate-100 dark:hover:bg-slate-800',
                    'focus:outline-none focus:ring-2 focus:ring-fintech-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                    isOpen && 'bg-slate-100 dark:bg-slate-800'
                )}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={isOpen}
            >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-bold text-white bg-red-500 rounded-full px-1 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className={clsx(
                    'absolute right-0 mt-2 w-96 max-h-[500px] overflow-hidden',
                    'bg-white dark:bg-slate-800 rounded-2xl shadow-xl',
                    'border border-slate-200 dark:border-slate-700',
                    'animate-slide-up z-50'
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-2 text-sm font-normal text-slate-500">
                                    ({unreadCount} unread)
                                </span>
                            )}
                        </h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={onMarkAllAsRead}
                                    className="text-xs text-fintech-600 dark:text-fintech-400 hover:underline font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={onClear}
                                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[380px]">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    No notifications
                                </p>
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    You're all caught up!
                                </p>
                            </div>
                        ) : (
                            visibleNotifications.map((notification) => {
                                const config = getTypeConfig(notification.type);
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={clsx(
                                            'relative px-4 py-3 border-l-4 transition-colors',
                                            config.borderColor,
                                            notification.read
                                                ? 'bg-white dark:bg-slate-800'
                                                : 'bg-slate-50 dark:bg-slate-700/50',
                                            'hover:bg-slate-50 dark:hover:bg-slate-700/70'
                                        )}
                                        onClick={() => !notification.read && onMarkAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div
                                                className={clsx(
                                                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                                                    config.bgColor
                                                )}
                                            >
                                                <Icon className={clsx('w-4 h-4', config.iconColor)} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={clsx(
                                                        'text-sm font-medium text-slate-900 dark:text-white',
                                                        !notification.read && 'font-semibold'
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDismiss(notification.id);
                                                        }}
                                                        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {formatTime(notification.timestamp)}
                                                    </span>
                                                    {notification.action && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                notification.action?.onClick();
                                                            }}
                                                            className="flex items-center gap-1 text-xs font-medium text-fintech-600 dark:text-fintech-400 hover:underline"
                                                        >
                                                            {notification.action.label}
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Unread indicator */}
                                            {!notification.read && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <span className="w-2 h-2 bg-fintech-500 rounded-full block" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {remainingCount > 0 && (
                            <div className="px-4 py-3 text-center border-t border-slate-200 dark:border-slate-700">
                                <button className="text-sm text-fintech-600 dark:text-fintech-400 font-medium hover:underline">
                                    View {remainingCount} more notifications
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
