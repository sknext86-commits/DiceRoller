export const THEME_PRESETS = {
  crimson: {
    id: 'crimson',
    name: 'Crimson Passion',
    primary: '#DC143C',
    secondary: '#8B0000',
    accent: '#FF1744',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#DC143C',
  },
  gold: {
    id: 'gold',
    name: 'Black & Gold',
    primary: '#FFD700',
    secondary: '#B8860B',
    accent: '#FFA500',
    background: '#000000',
    surface: '#1C1C1C',
    surfaceVariant: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#A8A8A8',
    border: '#FFD700',
  },
  pink: {
    id: 'pink',
    name: 'Hot Pink Nights',
    primary: '#FF1493',
    secondary: '#C71585',
    accent: '#FF69B4',
    background: '#0D0D0D',
    surface: '#1B1B1B',
    surfaceVariant: '#282828',
    text: '#FFFFFF',
    textSecondary: '#BEBEBE',
    border: '#FF1493',
  },
  neon: {
    id: 'neon',
    name: 'Neon Lime',
    primary: '#39FF14',
    secondary: '#00FF00',
    accent: '#7FFF00',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceVariant: '#252525',
    text: '#FFFFFF',
    textSecondary: '#C0C0C0',
    border: '#39FF14',
  },
} as const;

export type ThemeId = keyof typeof THEME_PRESETS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;
