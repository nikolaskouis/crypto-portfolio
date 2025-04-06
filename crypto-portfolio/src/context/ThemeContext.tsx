'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@/theme';

const ThemeContext = createContext({
    toggleTheme: () => {},
    isDarkMode: false,
});

export const ThemeToggleProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    const theme = useMemo(
        () => (isDarkMode ? darkTheme : lightTheme),
        [isDarkMode]
    );

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme === 'true') setIsDarkMode(true);
        setMounted(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', String(isDarkMode));
    }, [isDarkMode]);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
