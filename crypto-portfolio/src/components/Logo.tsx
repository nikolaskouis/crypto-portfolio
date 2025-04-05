import React from 'react';
import { Box } from "@mui/material";
import {circleLineEffect} from "@/utils/animations";

const Logo = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
                ...circleLineEffect
            }}
        >
            <Box
                component="img"
                src="https://pnghq.com/wp-content/uploads/crypto-logos-png-crisp-quality-350x350.png"
                alt="Logo"
                sx={{ width: 40, height: 40 }}
            />
        </Box>
    );
};

export default Logo;