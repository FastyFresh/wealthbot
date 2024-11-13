import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Menu,
  X,
  Bot,
  ChartBar,
  Wallet,
  Users,
  Clock,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  scrollToSection,
}) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1221]/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent"
          >
            Wealthbot
          </motion.h1>

          <div className="hidden md:flex items-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-[#38BDF8] transition-colors duration-300"
            >
              Features
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-[#38BDF8] transition-colors duration-300"
            >
              How It Works
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }}>
              <WalletMultiButton
                className="!bg-[#38BDF8] hover:!bg-[#38BDF8]/80 !transition-all !duration-300 
                                        hover:!shadow-lg hover:!shadow-[#38BDF8]/20 hover:!translate-y-[-2px]"
              />
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-[#38BDF8] transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            <motion.button
              whileHover={{ x: 10 }}
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-gray-300 hover:text-[#38BDF8] transition-colors duration-300"
            >
              Features
            </motion.button>
            <motion.button
              whileHover={{ x: 10 }}
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-gray-300 hover:text-[#38BDF8] transition-colors duration-300"
            >
              How It Works
            </motion.button>
            <div className="pt-2">
              <WalletMultiButton className="!bg-[#38BDF8] hover:!bg-[#38BDF8]/80 !transition-all !duration-300 w-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

interface AnimatedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  delay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-[#1E293B] p-8 rounded-xl transform transition-all duration-300 hover:scale-[1.02] 
                hover:shadow-lg hover:shadow-[#38BDF8]/10 hover:border-[#38BDF8]/20 border border-transparent
                relative overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[gradient_15s_linear_infinite]" />

      <motion.div
        animate={
          isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.3 }}
        className={`bg-[#${color}]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                  group-hover:shadow-[0_0_20px_rgba(${parseInt(color.substring(0, 2), 16)},${parseInt(color.substring(2, 4), 16)},${parseInt(color.substring(4, 6), 16)},0.3)]`}
      >
        {icon}
      </motion.div>

      <motion.h4
        animate={isHovered ? { x: 10 } : { x: 0 }}
        className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-[#38BDF8] flex items-center gap-2"
      >
        {title}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.span>
      </motion.h4>

      <motion.p
        animate={isHovered ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.7 }}
        className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="mt-6 pt-4 border-t border-gray-700/50"
      >
        <span className="text-[#38BDF8] text-sm flex items-center gap-2">
          Learn more <ArrowRight className="w-4 h-4" />
        </span>
      </motion.div>
    </motion.div>
  );
};

const FEATURES = [
  {
    icon: <Bot className="h-6 w-6 text-[#38BDF8]" />,
    title: 'AI-Powered Trading',
    description:
      'Experience 24/7 automated trading powered by sophisticated AI algorithms. Our system analyzes market patterns, executes trades, and optimizes your portfolio while you sleep.',
    color: '38BDF8',
  },
  {
    icon: <Shield className="h-6 w-6 text-[#818CF8]" />,
    title: 'Smart Risk Management',
    description:
      'Advanced risk controls and dynamic position sizing protect your portfolio in all market conditions. Our AI constantly monitors and adjusts to maintain optimal risk levels.',
    color: '818CF8',
  },
  {
    icon: <ChartBar className="h-6 w-6 text-[#22C55E]" />,
    title: '$1M Growth Target',
    description:
      'Strategic compound growth targeting $1,000,000 over 3-5 years. Our AI implements sophisticated trading strategies designed to maximize long-term returns.',
    color: '22C55E',
  },
];

const STATS = [
  {
    icon: <Users className="h-6 w-6 text-[#38BDF8]" />,
    value: '10,000+',
    label: 'Active Users',
    prefix: '',
  },
  {
    icon: <ChartBar className="h-6 w-6 text-[#818CF8]" />,
    value: '2.5',
    label: 'Million in AUM',
    prefix: '$',
  },
  {
    icon: <Clock className="h-6 w-6 text-[#22C55E]" />,
    value: '99.9',
    label: 'Uptime',
    prefix: '',
    suffix: '%',
  },
];

const TRUST_INDICATORS = [
  {
    icon: <Shield className="h-6 w-6 text-[#38BDF8]" />,
    title: 'Bank-Grade Security',
    description:
      'Multi-signature wallets and advanced encryption protect your assets 24/7',
  },
  {
    icon: <Award className="h-6 w-6 text-[#818CF8]" />,
    title: 'Proven Track Record',
    description: 'Consistent performance through various market conditions',
  },
  {
    icon: <Bot className="h-6 w-6 text-[#22C55E]" />,
    title: 'AI-Powered Decisions',
    description: 'Advanced algorithms making data-driven trading decisions',
  },
];

const STEPS = [
  {
    icon: <Wallet className="h-6 w-6 text-[#38BDF8]" />,
    number: 1,
    title: 'Start with $100 SOL',
    description:
      "Begin your journey with just $100 worth of SOL. Connect your wallet and you're ready to go.",
    color: '38BDF8',
  },
  {
    icon: <Bot className="h-6 w-6 text-[#818CF8]" />,
    number: 2,
    title: 'AI Takes Control',
    description:
      'Our advanced AI system begins trading automatically, making data-driven decisions 24/7.',
    color: '818CF8',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#22C55E]" />,
    number: 3,
    title: 'Watch Your Wealth Grow',
    description:
      'Monitor your progress as our AI works towards your $1,000,000 goal - no active management needed.',
    color: '22C55E',
  },
];

const StatsCard: React.FC<{ stat: (typeof STATS)[0]; index: number }> = ({
  stat,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ y: -5 }}
      className="text-center p-8 bg-[#1E293B]/50 rounded-xl backdrop-blur-sm"
    >
      <motion.div
        className="mb-4 flex justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <div
          className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center
                       shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          {stat.icon}
        </div>
      </motion.div>
      <motion.h4
        className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        {stat.prefix}
        {stat.value}
        {stat.suffix}
      </motion.h4>
      <p className="text-gray-400">{stat.label}</p>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
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

      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#38BDF8]/5 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
                Your Hedge Fund in Your Pocket
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-12"
            >
              Start with just $100 in SOL and let our AI grow it to $1,000,000.
              Professional-grade trading automation working for you 24/7.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="group px-8 py-3 bg-[#38BDF8] rounded-lg font-semibold w-full md:w-auto
                          flex items-center justify-center hover:bg-[#38BDF8]/90 
                          transition-all duration-300 transform
                          hover:shadow-lg hover:shadow-[#38BDF8]/20"
                >
                  {isLoading ? (
                    'Connecting...'
                  ) : (
                    <>
                      Start Growing{' '}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-8 py-3 bg-[#1E293B] rounded-lg font-semibold w-full md:w-auto
                          hover:bg-[#1E293B]/90 transition-all duration-300"
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="py-20 bg-[#0F172A] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1221] to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Professional-Grade Trading Technology
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {FEATURES.map((feature, index) => (
              <AnimatedFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <StatsCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0F172A] relative">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Why Trust Wealthbot?
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_INDICATORS.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#1E293B] p-8 rounded-xl transform transition-all duration-300
                         hover:shadow-lg hover:shadow-[#38BDF8]/10 group"
              >
                <motion.div
                  className="mb-6 w-12 h-12 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  {indicator.icon}
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-[#38BDF8]">
                  {indicator.title}
                </h4>
                <p className="text-gray-400">{indicator.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Three Steps to Financial Growth
          </motion.h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start space-x-6 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl bg-[#${step.color}]/20 flex items-center justify-center flex-shrink-0
                                transform transition-all duration-300
                                group-hover:shadow-[0_0_20px_rgba(${parseInt(step.color.substring(0, 2), 16)},${parseInt(step.color.substring(2, 4), 16)},${parseInt(step.color.substring(4, 6), 16)},0.3)]`}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="transform group-hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-xl font-semibold mb-2 text-[#38BDF8]">
                      {step.title}
                    </h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-12">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>© 2024 Wealthbot. All rights reserved.</p>
            <p className="mt-2">
              Trading cryptocurrencies involves risk. Please invest responsibly.
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-[#38BDF8] transition-colors duration-300"
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-[#38BDF8] transition-colors duration-300"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-[#38BDF8] transition-colors duration-300"
              >
                Contact Us
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
