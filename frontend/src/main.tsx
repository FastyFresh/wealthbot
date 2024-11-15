import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { WalletProvider } from './providers/WalletProvider'

function main() {
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  
  const root = ReactDOM.createRoot(container)
  
  root.render(
    <React.StrictMode>
      <WalletProvider>
        <App />
      </WalletProvider>
    </React.StrictMode>
  )
}

main()