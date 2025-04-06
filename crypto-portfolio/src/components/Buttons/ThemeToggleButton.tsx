import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { circleLineEffect } from '@/utils/animations';

export default function ThemeToggleButton() {
    const { toggleTheme, isDarkMode } = useTheme();

    return (
        <Box
            sx={{
8                ...circleLineEffect,
            }}
        >
            <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Box>
    );
}
