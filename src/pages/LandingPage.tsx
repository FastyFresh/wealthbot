import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Shield, Zap, TrendingUp, Menu, X } from 'lucide-react';

const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  fadeInDelay: 'animate-fade-in-delay',
  fadeInDelay2: 'animate-fade-in-delay-2'
};

interface AnimatedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({ icon, title, description, color }) => {
  return (
    <div className="group bg-[#1E293B] p-8 rounded-xl transform transition-all duration-300 hover:scale-[1.02] 
                    hover:shadow-lg hover:shadow-[#38BDF8]/10 hover:border-[#38BDF8]/20 border border-transparent">
      <div className={`bg-[#${color}]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                    group-hover:scale-110 transition-transform duration-300
                    group-hover:shadow-[0_0_20px_rgba(${parseInt(color.substring(0,2),16)},${parseInt(color.substring(2,4),16)},${parseInt(color.substring(4,6),16)},0.3)]`}>
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-[#38BDF8]">{title}</h4>
      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{description}</p>
    </div>
  );
};

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection }) => {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0B1221]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
            Wealthbot
          </h1>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} 
                    className="text-gray-300 hover:text-[#38BDF8] transition-colors duration-300 hover:scale-105 transform">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} 
                    className="text-gray-300 hover:text-[#38BDF8] transition-colors duration-300 hover:scale-105 transform">
              How It Works
            </button>
            <WalletMultiButton className="!bg-[#38BDF8] hover:!bg-[#38BDF8]/80 !transition-all !duration-300 
                                        hover:!shadow-lg hover:!shadow-[#38BDF8]/20 hover:!translate-y-[-2px]" />
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="text-gray-300 hover:text-[#38BDF8] transition-colors duration-300">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-4">
            <button onClick={() => scrollToSection('features')} 
                    className="block w-full text-left text-gray-300 hover:text-[#38BDF8] transition-colors duration-300">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} 
                    className="block w-full text-left text-gray-300 hover:text-[#38BDF8] transition-colors duration-300">
              How It Works
            </button>
            <div className="pt-2">
              <WalletMultiButton className="!bg-[#38BDF8] hover:!bg-[#38BDF8]/80 !transition-all !duration-300 w-full" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="group px-8 py-3 bg-[#38BDF8] rounded-lg font-semibold 
                flex items-center justify-center hover:bg-[#38BDF8]/90 
                transition-all duration-300 transform hover:scale-105
                hover:shadow-lg hover:shadow-[#38BDF8]/20 
                hover:translate-y-[-2px] active:translate-y-[0px]
                disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

const FEATURES = [
  {
    icon: <Zap className="h-6 w-6 text-[#38BDF8] group-hover:scale-110 transition-transform" />,
    title: "Autonomous Trading",
    description: "Our AI-powered system executes trades automatically using sophisticated algorithms and real-time market analysis.",
    color: "38BDF8"
  },
  {
    icon: <Shield className="h-6 w-6 text-[#818CF8] group-hover:scale-110 transition-transform" />,
    title: "Risk Management",
    description: "Advanced risk controls and position sizing ensure your portfolio stays protected in all market conditions.",
    color: "818CF8"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#22C55E] group-hover:scale-110 transition-transform" />,
    title: "Performance Tracking",
    description: "Monitor your progress with real-time analytics, detailed reports, and comprehensive performance metrics.",
    color: "22C55E"
  }
];

const STEPS = [
  {
    number: 1,
    title: "Connect Your Wallet",
    description: "Link your Phantom wallet to get started. We support both devnet and mainnet.",
    color: "38BDF8"
  },
  {
    number: 2,
    title: "Fund Your Account",
    description: "Deposit a minimum of $100 SOL to begin trading. All funds remain under your control.",
    color: "818CF8"
  },
  {
    number: 3,
    title: "Start Growing",
    description: "Our AI system begins trading automatically, working towards your $1,000,000 goal.",
    color: "22C55E"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      await navigate('/fund');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1221] text-white overflow-x-hidden">
      <Navbar 
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent ${ANIMATIONS.fadeIn}`}>
              Autonomous Trading for Your Wealth Growth
            </h2>
            <p className={`text-xl text-gray-400 mb-12 ${ANIMATIONS.fadeInDelay}`}>
              Let our AI-powered trading system help you reach your $1,000,000 goal through sophisticated algorithmic trading on the Solana blockchain.
            </p>
            <div className={`flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 ${ANIMATIONS.fadeInDelay2}`}>
              <PrimaryButton onClick={handleGetStarted} disabled={isLoading}>
                {isLoading ? 'Connecting...' : (
                  <>
                    Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </PrimaryButton>
              <button className="px-8 py-3 bg-[#1E293B] rounded-lg font-semibold 
                               hover:bg-[#1E293B]/90 transition-all duration-300 
                               transform hover:scale-105 hover:shadow-lg
                               hover:translate-y-[-2px] active:translate-y-[0px]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0F172A] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1221] to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <h3 className="text-3xl font-bold text-center mb-16">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {FEATURES.map((feature, index) => (
              <AnimatedFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-start space-x-6 group">
                  <div className={`w-8 h-8 rounded-full bg-[#${step.color}] flex items-center justify-center flex-shrink-0
                                 transform group-hover:scale-110 transition-transform duration-300
                                 group-hover:shadow-[0_0_20px_rgba(${parseInt(step.color.substring(0,2),16)},${parseInt(step.color.substring(2,4),16)},${parseInt(step.color.substring(4,6),16)},0.3)]`}>
                    {step.number}
                  </div>
                  <div className="transform group-hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 relative">
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