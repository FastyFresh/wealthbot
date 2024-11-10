import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/fund');
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
              Autonomous Trading for Your Wealth Growth
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Let our AI-powered trading system help you reach your $1,000,000 goal through sophisticated algorithmic trading on the Solana blockchain.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#38BDF8] rounded-lg font-semibold flex items-center hover:bg-[#38BDF8]/90 transition-colors"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-3 bg-[#1E293B] rounded-lg font-semibold hover:bg-[#1E293B]/90 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-[#1E293B] p-8 rounded-xl">
              <div className="bg-[#38BDF8]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-[#38BDF8]" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Autonomous Trading</h4>
              <p className="text-gray-400">
                Our AI-powered system executes trades automatically using sophisticated algorithms and real-time market analysis.
              </p>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-xl">
              <div className="bg-[#818CF8]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-[#818CF8]" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Risk Management</h4>
              <p className="text-gray-400">
                Advanced risk controls and position sizing ensure your portfolio stays protected in all market conditions.
              </p>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-xl">
              <div className="bg-[#22C55E]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#22C55E]" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Performance Tracking</h4>
              <p className="text-gray-400">
                Monitor your progress with real-time analytics, detailed reports, and comprehensive performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="w-8 h-8 rounded-full bg-[#38BDF8] flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Connect Your Wallet</h4>
                  <p className="text-gray-400">
                    Link your Phantom wallet to get started. We support both devnet and mainnet.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-8 h-8 rounded-full bg-[#818CF8] flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Fund Your Account</h4>
                  <p className="text-gray-400">
                    Deposit a minimum of $100 SOL to begin trading. All funds remain under your control.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Start Growing</h4>
                  <p className="text-gray-400">
                    Our AI system begins trading automatically, working towards your $1,000,000 goal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>© 2024 Wealthbot. All rights reserved.</p>
            <p className="mt-2">
              Trading cryptocurrencies involves risk. Please invest responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}