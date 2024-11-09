
export const theme = {
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
  layout: {
    grid: {
      columns: 12,
      gap: '1rem'
    },
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px'
    }
  },
  spacing: {
    compact: '0.5rem',
    regular: '1rem',
    wide: '1.5rem'
  },
  interaction: {
    hover: {
      scale: 1.02,
      transition: '150ms ease'
    },
    click: {
      scale: 0.98,
      transition: '100ms ease'
    }
  }
}

export type Theme = typeof theme;
