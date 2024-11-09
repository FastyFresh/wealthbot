
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          background: '#0F172A',    // Dark blue base
          surface: '#1E293B',       // Lighter blue surface
          accent: '#38BDF8'         // Bright blue accent
        },
        trading: {
          profit: '#22C55E',        // Green
          loss: '#EF4444',          // Red
          neutral: '#94A3B8'        // Gray
        },
        text: {
          primary: '#F8FAFC',       // Almost white
          secondary: '#CBD5E1',     // Light gray
          muted: '#64748B'          // Muted blue-gray
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        '3xl': '1920px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(56, 189, 248, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
