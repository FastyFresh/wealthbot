import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center bg-red-50 rounded-lg p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-red-600">{this.state.error?.message || 'An error occurred'}</p>
            <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}