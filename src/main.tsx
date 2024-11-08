// Initialize polyfills first
import './utils/init-polyfills';

// React imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './providers/WalletProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Global error handlers
const handleError = (error: Error) => {
  console.error('Application error:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #ef4444;">Application Error</h1>
        <p style="color: #666;">An error occurred while loading the application.</p>
        <pre style="background: #f5f5f5; padding: 10px; text-align: left; margin-top: 20px; overflow-x: auto;">
          ${error.message}
        </pre>
        <button onclick="window.location.reload()" 
                style="margin-top: 20px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Application
        </button>
      </div>
    `;
  }
};

// Initialize application
const initializeApp = async () => {
  console.log('Initializing application...');
  
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);

    console.log('Rendering application...');
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <WalletProvider>
            <App />
          </WalletProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    handleError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};

// Set up global error handlers
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  handleError(error || new Error(message as string));
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
};

// Start the application
console.log('Starting application initialization...');
initializeApp().catch(handleError);