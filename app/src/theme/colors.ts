export const colors = {
  background: {
    primary: '#F7F3EE',
    secondary: '#FFFDF9',
    tinted: '#F2ECE5',
  },
  surface: {
    default: '#FFFDF9',
    elevated: '#FFFFFF',
    glass: 'rgba(255, 253, 249, 0.88)',
    subtle: '#F6EFE7',
  },
  text: {
    primary: '#1F1A17',
    secondary: '#6D625A',
    tertiary: '#978A80',
    inverse: '#FFFDF9',
  },
  border: {
    subtle: '#E8DDD3',
    strong: '#D3C2B2',
  },
  brand: {
    primary: '#F07F3B',
    secondary: '#F4A261',
    accent: '#7DBA6E',
  },
  state: {
    success: '#2F8F5B',
    warning: '#D9822B',
    error: '#D65A4A',
    info: '#4D84C4',
  },
} as const;

export type AppColors = typeof colors;
