import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#121A27',
        },
        secondary: {
            main: '#50E3C2',
        },
        background: {
            default: '#0A0E16',
            paper: '#121A27',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#A7B6D2',
        },
        success: {
            main: '#00C853',
        },
        error: {
            main: '#FF1744',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: { fontWeight: 700, fontSize: '2rem' },
        h2: { fontWeight: 600, fontSize: '1.5rem' },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.875rem' },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: '#162135',
                    color: '#FFFFFF',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.6)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#162135',
                    color: '#FFFFFF',
                },
            },
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976D2',
        },
        secondary: {
            main: '#02C39A',
        },
        background: {
            default: '#F4F7FA',
            paper: '#ffffff',
        },
        text: {
            primary: '#172B4D',
            secondary: '#6B778C',
        },
        success: {
            main: '#00BFA5',
        },
        error: {
            main: '#FF5252',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: { fontWeight: 700, fontSize: '2rem' },
        h2: { fontWeight: 600, fontSize: '1.5rem' },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.875rem' },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: '#FFFFFF',
                    color: '#172B4D',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#172B4D',
                },
            },
        },
    },
});

export { darkTheme, lightTheme };
