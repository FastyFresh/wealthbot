import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WalletConnect } from './WalletConnect';
import { useWallet } from '../../providers/WalletProvider';

// Mock the useWallet hook
vi.mock('../../providers/WalletProvider', () => ({
  useWallet: vi.fn(),
}));

describe('WalletConnect', () => {
  it('renders disconnected state correctly', () => {
    vi.mocked(useWallet).mockReturnValue({
      connected: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);

    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Connect Wallet');
  });

  it('renders connected state correctly', () => {
    vi.mocked(useWallet).mockReturnValue({
      connected: true,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Disconnect');
  });

  it('displays error message when error exists', () => {
    const errorMessage = 'Failed to connect wallet';
    vi.mocked(useWallet).mockReturnValue({
      connected: false,
      error: errorMessage,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls connect when clicking connect button', () => {
    const connectMock = vi.fn();
    vi.mocked(useWallet).mockReturnValue({
      connected: false,
      error: null,
      connect: connectMock,
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);

    fireEvent.click(screen.getByRole('button'));
    expect(connectMock).toHaveBeenCalled();
  });

  it('calls disconnect when clicking disconnect button', () => {
    const disconnectMock = vi.fn();
    vi.mocked(useWallet).mockReturnValue({
      connected: true,
      error: null,
      connect: vi.fn(),
      disconnect: disconnectMock,
    });

    render(<WalletConnect />);

    fireEvent.click(screen.getByRole('button'));
    expect(disconnectMock).toHaveBeenCalled();
  });
});
