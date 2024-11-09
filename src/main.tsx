import './utils/init-polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './providers/WalletProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <WalletProvider>
          <App />
        </WalletProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('Application initialized successfully');
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