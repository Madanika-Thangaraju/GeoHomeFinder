export const COLORS = {
  primary: '#2563EB', // Strong Blue (Login Button)
  primaryDark: '#1E3A8A',
  secondary: '#64748B',
  background: '#F8FAFC', // Slate 50 (Clean Light)
  backgroundDark: '#0F172A', // Deep Blue/Black
  surface: '#FFFFFF', // White Card
  surfaceHighlight: '#F1F5F9', // Light Gray inputs
  textPrimary: '#0F172A', // Slate 900 (Dark text)
  textSecondary: '#64748B', // Slate 500 (Gray text)
  textInverse: '#FFFFFF', // White text
  success: '#10B981',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  glassBorder: 'rgba(226, 232, 240, 0.8)', // Slate 200 (Light Border)
  inputBackground: '#F1F5F9', // Slate 100
};

export const GRADIENTS = {
  background: ['#F8FAFC', '#F1F5F9'] as const, // Light Gradient
  primaryButton: ['#2563EB', '#1D4ED8'] as const, // Blue Scale
  secondaryButton: ['#FFFFFF', '#F8FAFC'] as const, // White/Light
  card: ['#FFFFFF', '#FFFFFF'] as const, // Clean White
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
};

export const LAYOUT = {
  radius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
  },
  shadow: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  }
};
