import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Reusable Skeleton loading component
 * Provides visual feedback while content is loading
 * 
 * @example
 * <Skeleton variant="text" width={200} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={120} />
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'text',
    width,
    height,
    animation = 'pulse',
}) => {
    const baseStyles = 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]';

    const variantStyles = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-lg',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-skeleton-wave',
        none: '',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={cn(
                baseStyles,
                variantStyles[variant],
                animationStyles[animation],
                className
            )}
            style={style}
            aria-label="Loading..."
            role="status"
        />
    );
};

/**
 * Card skeleton for dashboard cards
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6',
        className
    )}>
        <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={60} />
        </div>
        <Skeleton variant="text" width="60%" className="mb-2" />
        <Skeleton variant="text" width="40%" height={32} />
    </div>
);

/**
 * Transaction list skeleton
 */
export const TransactionListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
            >
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                    <Skeleton variant="text" width="70%" className="mb-2" />
                    <Skeleton variant="text" width="40%" height={12} />
                </div>
                <Skeleton variant="text" width={80} height={24} />
            </div>
        ))}
    </div>
);

/**
 * Table skeleton for data tables
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
    rows = 5,
    columns = 4,
}) => (
    <div className="w-full">
        {/* Header */}
        <div className="flex gap-4 p-4 border-b border-white/10">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} variant="text" width="25%" height={16} />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 p-4 border-b border-white/5">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <Skeleton key={colIndex} variant="text" width="25%" height={20} />
                ))}
            </div>
        ))}
    </div>
);

/**
 * Chart skeleton for graph placeholders
 */
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('p-6', className)}>
        <div className="flex items-end justify-between h-48 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={`${Math.random() * 60 + 40}%`}
                    className="rounded-t"
                />
            ))}
        </div>
        <div className="flex justify-between mt-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                <Skeleton key={month} variant="text" width={30} />
            ))}
        </div>
    </div>
);

/**
 * Profile skeleton for user cards
 */
export const ProfileSkeleton: React.FC = () => (
    <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={64} height={64} />
        <div>
            <Skeleton variant="text" width={150} className="mb-2" />
            <Skeleton variant="text" width={100} height={14} />
        </div>
    </div>
);

export default Skeleton;
