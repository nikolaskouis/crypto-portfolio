import React from 'react';
import { Box, Container } from '@mui/material';
import MarketCoins from '@/components/Shortcuts/MarketCoins';
import CryptoPage from '@/app/crypto/page';

export default function Home() {
    return (
        <Box
            component="main"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="background.default"
            px={2}
            sx={{ paddingBottom: '2rem' }}
        >
            <Container maxWidth="md">
                <MarketCoins />
                <CryptoPage />
            </Container>
        </Box>
    );
}
