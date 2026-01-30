import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // High contrast white for primary actions
      dark: '#e0e0e0',
    },
    secondary: {
      main: '#52525b', // Zinc-600 for secondary accents
    },
    background: {
      default: '#09090b', // Zinc-950 (Deep Blackish-Gray)
      paper: '#18181b',   // Zinc-900 (Slightly lighter card background)
    },
    text: {
      primary: '#fafafa', // Zinc-50
      secondary: '#a1a1aa', // Zinc-400
    },
    divider: '#27272a', // Zinc-800 for subtle borders
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    action: {
        hover: 'rgba(255, 255, 255, 0.05)',
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600, letterSpacing: '0px' },
    button: { fontWeight: 500, textTransform: 'none', letterSpacing: '0.2px' },
    body1: { lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 8, // Tighter, cleaner corners (less bubbly)
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#09090b',
          scrollbarColor: "#3f3f46 #09090b",
          "&::-webkit-scrollbar": { width: '8px' },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#3f3f46", borderRadius: 4 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Disable Material UI overlay
          border: '1px solid #27272a', // Subtle border for definition
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', backgroundColor: '#e0e0e0' },
        },
        contained: {
          backgroundColor: '#fafafa',
          color: '#09090b',
          '&:hover': { backgroundColor: '#ffffff' },
        },
        outlined: {
          borderColor: '#3f3f46',
          color: '#fafafa',
          '&:hover': { borderColor: '#71717a', backgroundColor: 'transparent' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#09090b',
            '& fieldset': { borderColor: '#3f3f46' }, // Darker, subtler borders
            '&:hover fieldset': { borderColor: '#71717a' },
            '&.Mui-focused fieldset': { borderColor: '#fafafa' }, // White focus ring
          },
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: '#18181b', // Explicit card color
            }
        }
    }
  },
});