export const theme = {
  colors: {
    bgApp: '#090D16',       // Very dark navy / near black background
    bgSurface: '#111827',   // Slightly lighter navy surface cards
    bgSurfaceHover: '#1F2937',
    borderSubtle: '#1E293B',// Low-contrast borders
    borderStrong: '#334155',
    textMain: '#F8FAFC',    // Crisp white primary text
    textMuted: '#94A3B8',   // Slate secondary text
    textSubtle: '#64748B',  // Muted labels
    primary: '#10B981',     // Emerald accent
    primaryHover: '#059669',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  typography: {
    display: 'text-3xl lg:text-4xl font-extrabold tracking-tight',
    pageTitle: 'text-xl lg:text-2xl font-bold text-white',
    sectionHeading: 'text-base lg:text-lg font-semibold text-white',
    cardHeading: 'text-sm font-semibold text-slate-200',
    body: 'text-sm text-slate-300',
    secondary: 'text-xs text-slate-400',
    label: 'text-xs font-medium text-slate-400 uppercase tracking-wider',
  },
  borderRadius: {
    card: 'rounded-2xl',
    input: 'rounded-xl',
    button: 'rounded-xl',
  }
};