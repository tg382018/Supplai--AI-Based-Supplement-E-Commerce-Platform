import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#10b981', // Emerald
            dark: '#059669',
            light: '#34d399',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6b6b', // Coral
            dark: '#fa5252',
            light: '#ff8787',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#6b7280',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 900,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 800,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 800,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#059669',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                            borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                            borderColor: '#10b981',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
