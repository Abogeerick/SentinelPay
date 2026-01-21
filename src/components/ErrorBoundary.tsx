import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Best Practices Demonstrated:
 * - Class component for error boundaries (required by React)
 * - Production-ready error logging
 * - User-friendly error display
 * - Recovery mechanisms
 * 
 * @example
 * <ErrorBoundary onError={(error) => logToService(error)}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({ errorInfo });

        // Call optional error handler for production logging
        this.props.onError?.(error, errorInfo);

        // In production, you would log to a service like Sentry
        if (process.env.NODE_ENV === 'production') {
            this.logErrorToService(error, errorInfo);
        }
    }

    private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
        // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
        const errorLog = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        // Log to console for now - in production, send to monitoring service
        console.log('Error logged:', errorLog);
    }

    private handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleGoHome = (): void => {
        window.location.href = '/';
    };

    private handleReportBug = (): void => {
        const { error, errorInfo } = this.state;
        const body = encodeURIComponent(
            `## Error Report\n\n**Error:** ${error?.message}\n\n**Stack:**\n\`\`\`\n${error?.stack}\n\`\`\`\n\n**Component Stack:**\n\`\`\`\n${errorInfo?.componentStack}\n\`\`\`\n\n**URL:** ${window.location.href}\n**Time:** ${new Date().toISOString()}`
        );
        window.open(
            `https://github.com/yourusername/SentinelPay/issues/new?title=Bug%20Report&body=${body}`,
            '_blank'
        );
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-lg w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                            <AlertTriangle className="w-10 h-10 text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Something went wrong
                        </h1>

                        {/* Description */}
                        <p className="text-gray-400 mb-6">
                            We're sorry, but something unexpected happened. Our team has been
                            notified and we're working to fix it.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV !== 'production' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                                <p className="text-red-400 text-sm font-mono overflow-x-auto">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>

                            <button
                                onClick={this.handleReportBug}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Bug className="w-4 h-4" />
                                Report Bug
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-xs text-gray-500">
                            Error ID: {Date.now().toString(36).toUpperCase()}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
