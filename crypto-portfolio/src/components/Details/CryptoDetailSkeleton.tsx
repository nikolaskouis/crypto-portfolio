import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { Skeleton } from '@mui/material';

const CryptoDetailSkeleton = () => {
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
            {/* Header with Logo and Navigation */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h5" fontWeight="bold">
                    Coin Details
                </Typography>
                <Box display="flex" gap={2}>
                    <Skeleton
                        sx={{ bgcolor: 'background.paper' }}
                        width={80}
                        height={24}
                    />
                    <Skeleton
                        sx={{ bgcolor: 'background.paper' }}
                        width={80}
                        height={24}
                    />
                </Box>
            </Box>

            {/* Cryptocurrency Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Skeleton
                            sx={{ bgcolor: 'background.paper' }}
                            variant="circular"
                            width={32}
                            height={32}
                        />
                        <Skeleton
                            sx={{ bgcolor: 'background.paper' }}
                            width={150}
                            height={40}
                        />
                        <Skeleton
                            sx={{ bgcolor: 'background.paper' }}
                            width={30}
                            height={20}
                        />
                    </Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={0.5}
                    >
                        <Skeleton
                            sx={{ bgcolor: 'background.paper' }}
                            width={60}
                            height={24}
                        />
                        <Skeleton
                            sx={{ bgcolor: 'background.paper' }}
                            width={40}
                            height={20}
                        />
                    </Stack>
                </Box>
                <Skeleton
                    sx={{ bgcolor: 'background.paper', borderRadius: 28 }}
                    variant="rounded"
                    width={120}
                    height={36}
                />
            </Box>

            {/* Price Header */}
            <Box mb={3}>
                <Skeleton
                    sx={{ bgcolor: 'background.paper' }}
                    width={180}
                    height={60}
                />
            </Box>

            {/* Key Stats Grid */}
            <Grid container spacing={2} mb={4}>
                {[...Array(6)].map((_, index) => (
                    <Grid key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                            }}
                        >
                            <Skeleton width={120} height={20} />
                            <Skeleton width={100} height={32} sx={{ mt: 1 }} />
                            {index === 0 || index === 5 ? (
                                <Skeleton
                                    width={80}
                                    height={20}
                                    sx={{ mt: 1 }}
                                />
                            ) : null}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Chart Section */}
            <Box mb={4}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ overflowX: 'auto', mb: 3 }}
                >
                    {[...Array(5)].map((_, index) => (
                        <Skeleton
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                            key={index}
                            variant="rounded"
                            width={60}
                            height={32}
                        />
                    ))}
                </Stack>

                {/* Chart Display */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        mb: 3,
                    }}
                >
                    <Box height={300}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default CryptoDetailSkeleton;
