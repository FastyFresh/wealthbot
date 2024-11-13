import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Info } from 'lucide-react';

export default function FundingPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTrading = () => {
    setIsLoading(true);
    // Simulate funding process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1221] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Wealthbot</h1>
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          {/* Status Card */}
          <div className="bg-[#1E293B] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">System Status</h2>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                Ready
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Wallet Connected</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Network</span>
                <span>Mainnet</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Available Balance</span>
                <span>0.00 SOL</span>
              </div>
            </div>
          </div>

          {/* Funding Form */}
          <div className="bg-[#1E293B] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Fund Your Account</h2>

            {/* Minimum Requirements */}
            <div className="bg-[#0F172A] rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Minimum Requirements</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Minimum deposit: 100 SOL</li>
                    <li>• Additional 25 SOL for gas fees</li>
                    <li>• Phantom wallet connected</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funding Amount (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="100"
                  step="1"
                  className="w-full bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  SOL
                </span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTrading}
              disabled={isLoading || Number(amount) < 100}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center ${
                isLoading || Number(amount) < 100
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#38BDF8] hover:bg-[#38BDF8]/90'
              } transition-colors`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </div>
              ) : (
                <>
                  Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            {/* Additional Info */}
            <p className="text-sm text-gray-400 mt-4 text-center">
              By clicking Start Trading, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
