
import './utils/init-polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './providers/WalletProvider';
import { DriftProvider } from './providers/DriftProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Initialize Buffer for web3
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Initialize process for web3
import process from 'process';
window.process = process;

// Initialize global for web3
window.global = window;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <WalletProvider>
          <DriftProvider>
            <App />
          </DriftProvider>
        </WalletProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );

  // Initialize application monitoring
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    console.log('Application initialized in development mode');
    console.log('Available at:', window.location.href);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Polyfills initialized:', {
      hasBuffer: typeof window.Buffer !== 'undefined',
      hasProcess: typeof window.process !== 'undefined',
      hasGlobal: typeof window.global !== 'undefined'
    });

    // Add development-specific error handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });

    // Monitor React rendering
    const startTime = performance.now();
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      console.log(`Initial render completed in ${loadTime.toFixed(2)}ms`);
    });
  }
} catch (error) {
  console.error('Failed to initialize application:', error);
  
  // Render error state
  rootElement.innerHTML = `
    <div style="
      padding: 20px;
      margin: 20px;
      border-radius: 8px;
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      color: #991b1b;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <h1 style="margin: 0 0 10px 0; font-size: 1.5rem; font-weight: 600;">
        Application Error
      </h1>
      <p style="margin: 0 0 15px 0;">
        An error occurred while initializing the application. Please try refreshing the page.
      </p>
      <pre style="
        background-color: #fff;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.875rem;
      ">${error instanceof Error ? error.message : 'Unknown error occurred'}</pre>
      <button onclick="window.location.reload()" style="
        margin-top: 15px;
        padding: 8px 16px;
        background-color: #dc2626;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
      ">
        Reload Application
      </button>
    </div>
  `;
}
