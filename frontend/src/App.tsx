import React from 'react'
import { WalletProvider } from './providers/WalletProvider'
import { WalletConnect } from './components/wallet/WalletConnect'

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-2xl font-bold text-primary-600">WealthBot</h1>
              <WalletConnect />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="instructions">
            <h2 className="instruction-step">How to run this application:</h2>
            
            <p className="instruction-step">1. Install dependencies:</p>
            <code className="instruction-code">cd frontend</code>
            <code className="instruction-code">npm install</code>
            
            <p className="instruction-step">2. Start the development server:</p>
            <code className="instruction-code">npm run dev</code>
            
            <p className="instruction-step">3. Open in your browser:</p>
            <code className="instruction-code">http://localhost:5174</code>
            
            <p className="instruction-step">Prerequisites:</p>
            <ul className="list-disc list-inside text-green-600 ml-4">
              <li>Node.js installed</li>
              <li>Phantom wallet browser extension</li>
              <li>Modern web browser (Chrome, Firefox, or Edge)</li>
            </ul>
          </div>
        </main>
      </div>
    </WalletProvider>
  )
}

export default App