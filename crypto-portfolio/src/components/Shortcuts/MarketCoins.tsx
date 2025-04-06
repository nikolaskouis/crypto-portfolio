'use client';
import {
    Box,
    Container,
    InputBase,
    Paper,
    Typography,
    Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { useTheme } from '@mui/system';
import { hoverLineEffect } from '@/utils/animations';

// Dummy data
const coins = [
    {
        name: 'Bitcoin',
        icon: '🟠',
        price: '$38,447.54',
        change: '+2%',
        changeColor: 'green',
    },
    {
        name: 'Avalanche',
        icon: '🔴',
        price: '$38,447.54',
        change: '-2%',
        changeColor: 'red',
    },
    {
        name: 'Binance',
        icon: '🟡',
        price: '$38,447.54',
        change: '+2%',
        changeColor: 'green',
    },
];

const MarketCoins = () => {
    const theme = useTheme(); // custom theme

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                {/* Header */}
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    mb={3}
                    gap={2}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Market Coins
                        </Typography>
                        <Typography variant="body2">
                            Lorem Ipsum is simply dummy text of the printing.
                        </Typography>
                    </Box>

                    {/* Search */}
                    <Paper
                        component="form"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 250 },
                            borderRadius: 2,
                            px: 1,
                            ...hoverLineEffect,
                        }}
                    >
                        <SearchIcon />
                        <InputBase
                            sx={{ ml: 1, flex: 1, py: 0.5 }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'search coin' }}
                        />
                    </Paper>
                </Box>

                {/* Coins */}
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    mx={-1}
                >
                    {coins.map((coin, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: {
                                    xs: '50%',
                                    sm: '33.33%',
                                    md: '25%',
                                },
                                px: 1,
                                mb: 2,
                                display: 'flex',
                            }}
                        >
                            <Card
                                elevation={4}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    ...hoverLineEffect,
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Typography fontSize={24}>{coin.icon}</Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%',
                                            flexGrow: 1,
                                        }}
                                    >{coin.name}</Typography>
                                </Box>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%',
                                        flexGrow: 1,
                                    }}
                                >
                                    {coin.price}{' '}
                                </Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: '0.875rem',
                                        color:
                                            coin.changeColor === 'green'
                                                ? '#4CAF50'
                                                : '#F44336',
                                        ml: 1,
                                    }}
                                >
                                    {coin.change} {coin.changeColor === 'green' ? '📈' : '📉'}
                                </Box>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default MarketCoins;
