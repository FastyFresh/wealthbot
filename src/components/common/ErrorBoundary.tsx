
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { theme } from '../../config/theme';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Log to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Add production error logging service
            console.error('Production error:', {
                error: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack
            });
        }
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4" style={{ background: theme.colors.primary.background }}>
                    <div className="w-full max-w-2xl">
                        <div className="rounded-lg border shadow-lg overflow-hidden" style={{ 
                            background: theme.colors.primary.surface,
                            borderColor: theme.colors.trading.loss 
                        }}>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <svg className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                                        Application Error
                                    </h2>
                                </div>

                                <div className="mb-4" style={{ color: theme.colors.text.secondary }}>
                                    <p className="mb-2">An error occurred in the application:</p>
                                    <pre className="p-3 rounded text-sm overflow-auto" style={{ 
                                        background: theme.colors.primary.background,
                                        color: theme.colors.trading.loss
                                    }}>
                                        {this.state.error?.message || 'Unknown error'}
                                    </pre>
                                </div>

                                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                    <div className="mb-4">
                                        <p className="mb-2" style={{ color: theme.colors.text.secondary }}>Component Stack:</p>
                                        <pre className="p-3 rounded text-sm overflow-auto" style={{ 
                                            background: theme.colors.primary.background,
                                            color: theme.colors.text.muted
                                        }}>
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </div>
                                )}

                                <div className="flex space-x-4">
                                    <button
                                        onClick={this.handleReload}
                                        className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                                        style={{
                                            background: theme.colors.trading.loss,
                                            color: theme.colors.text.primary
                                        }}
                                    >
                                        Reload Application
                                    </button>
                                    <button
                                        onClick={this.handleReset}
                                        className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                                        style={{
                                            background: theme.colors.primary.accent,
                                            color: theme.colors.text.primary
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
