import React, { createContext, useContext, useState } from 'react'

interface WalletState {
  connected: boolean
  error: string | null
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within WalletProvider')
  return context
}

interface Props {
  children: React.ReactNode
}

export function WalletProvider({ children }: Props) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    error: null
  })

  const connect = async () => {
    try {
      const { solana } = window as any
      if (!solana?.isPhantom) {
        setState(prev => ({ ...prev, error: 'Phantom wallet not found!' }))
        return
      }
      const response = await solana.connect()
      setState(prev => ({
        ...prev,
        connected: true,
        error: null
      }))
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to connect' }))
    }
  }

  const disconnect = async () => {
    try {
      const { solana } = window as any
      if (solana) {
        await solana.disconnect()
        setState({
          connected: false,
          error: null
        })
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to disconnect' }))
    }
  }

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}