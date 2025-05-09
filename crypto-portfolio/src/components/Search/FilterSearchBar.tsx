'use client';
import {
    Box,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import React, { useEffect, useMemo, useState } from 'react';
import { hoverLineEffect } from '@/utils/animations';

interface IFilterSearchBarProps {
    cryptos: Crypto[];
    setFilteredCrypto: (crypto: Crypto[]) => void;
    search: string;
    setSearch: (search: string) => void;
    sortConfig: { key: keyof Crypto; direction: 'asc' | 'desc' } | null;
    setSortConfig: (
        sortConfig: { key: keyof Crypto; direction: 'asc' | 'desc' } | null
    ) => void;
}

const FilterSearchBar: React.FC<IFilterSearchBarProps> = ({
    cryptos,
    setFilteredCrypto,
    setSortConfig,
    search,
    setSearch,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const maxPrice = useMemo(() => {
        const validPrices = cryptos
            .map((c) => c.current_price)
            .filter(() => true);
        return Math.max(0, ...validPrices);
    }, [cryptos]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [performanceFilter, setPerformanceFilter] = useState<string>('all');
    const [marketCapFilter, setMarketCapFilter] = useState<string>('all');

    const marketCapCategories = {
        all: 0,
        small: 1000000000, // $1 Billiob
        medium: 10000000000, // $10 Billion
        large: 50000000000, // $50 Billion
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtered_Cryptos = cryptos.filter((crypto) => {
                const matchesSearch =
                    crypto.name.toLowerCase().includes(search.toLowerCase()) ||
                    crypto.symbol.toLowerCase().includes(search.toLowerCase());

                const matchesMarketCap =
                    marketCapFilter === 'all' ||
                    (marketCapFilter === 'small' &&
                        crypto.market_cap < marketCapCategories.medium) ||
                    (marketCapFilter === 'medium' &&
                        crypto.market_cap >= marketCapCategories.medium &&
                        crypto.market_cap < marketCapCategories.large) ||
                    (marketCapFilter === 'large' &&
                        crypto.market_cap >= marketCapCategories.large);

                const matchesPriceRange =
                    crypto.current_price >= priceRange[0] &&
                    crypto.current_price <= priceRange[1];

                const matchesPerformance =
                    performanceFilter === 'all' ||
                    (performanceFilter === 'positive' &&
                        crypto.price_change_percentage_24h > 0) ||
                    (performanceFilter === 'negative' &&
                        crypto.price_change_percentage_24h < 0);

                return (
                    matchesSearch &&
                    matchesMarketCap &&
                    matchesPriceRange &&
                    matchesPerformance
                );
            });

            setFilteredCrypto(filtered_Cryptos);
        }, 300); //timer added so it doesnt useEffect million times per second while moving the slider :D

        return () => {
            clearTimeout(handler);
        };
    }, [search, marketCapFilter, priceRange, performanceFilter, cryptos]);

    const handlePriceRangeChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        setPriceRange(newValue as [number, number]);
    };

    const clearFilters = () => {
        setSearch('');
        setMarketCapFilter('all');
        setPriceRange([0, maxPrice]);
        setPerformanceFilter('all');
        setSortConfig(null);
    };

    return (
        <>
            {/* Pills + Search */}
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
                        Coin List
                    </Typography>
                    <Typography variant="body2">
                        Lorem Ipsum is simply dummy text of the printing.
                    </Typography>
                </Box>

                {/* Search + Filter Icon */}
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
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton
                        sx={hoverLineEffect}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <TuneIcon />
                    </IconButton>
                </Paper>
            </Box>

            {/* Advanced Filters */}
            {showAdvanced && (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid>
                            <FormControl fullWidth>
                                <InputLabel>Market Cap</InputLabel>
                                <Select
                                    value={marketCapFilter}
                                    label="Market Cap"
                                    onChange={(e) =>
                                        setMarketCapFilter(e.target.value)
                                    }
                                >
                                    <MenuItem value="all">
                                        All Market Caps
                                    </MenuItem>
                                    <MenuItem value="small">
                                        Small Cap (&lt; $10B)
                                    </MenuItem>
                                    <MenuItem value="medium">
                                        Mid Cap ($10B - $50B)
                                    </MenuItem>
                                    <MenuItem value="large">
                                        Large Cap (&gt; $50B)
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <FormControl fullWidth>
                                <InputLabel>24h Performance</InputLabel>
                                <Select
                                    value={performanceFilter}
                                    label="24h Performance"
                                    onChange={(e) =>
                                        setPerformanceFilter(e.target.value)
                                    }
                                >
                                    <MenuItem value="all">
                                        All Performance
                                    </MenuItem>
                                    <MenuItem value="positive">
                                        Positive (+)
                                    </MenuItem>
                                    <MenuItem value="negative">
                                        Negative (-)
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mb: 3, ml: 1.5 }}>
                        <Grid sx={{ width: '100%' }}>
                            <Box>
                                <Typography>Price Range</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={maxPrice}
                                    valueLabelFormat={(value) =>
                                        `$${value.toLocaleString()}`
                                    }
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ${priceRange[0].toLocaleString()} - $
                                    {priceRange[1].toLocaleString()}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid>
                            <Chip
                                label="Clear All Filters"
                                onClick={clearFilters}
                                variant="outlined"
                                sx={{ ml: 'auto', ...hoverLineEffect }}
                            />
                        </Grid>
                    </Grid>
                </>
            )}

            {/* Active Filters */}
            {(search ||
                marketCapFilter !== 'all' ||
                performanceFilter !== 'all' ||
                priceRange[0] > 0 ||
                priceRange[1] < maxPrice) && (
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Active Filters:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {search && (
                            <Chip
                                size="small"
                                label={`Search: ${search}`}
                                onDelete={() => setSearch('')}
                            />
                        )}
                        {marketCapFilter !== 'all' && (
                            <Chip
                                size="small"
                                label={`Market Cap: ${marketCapFilter}`}
                                onDelete={() => setMarketCapFilter('all')}
                            />
                        )}
                        {performanceFilter !== 'all' && (
                            <Chip
                                size="small"
                                label={`Performance: ${performanceFilter}`}
                                onDelete={() => setPerformanceFilter('all')}
                            />
                        )}
                        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                            <Chip
                                size="small"
                                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                                onDelete={() => setPriceRange([0, maxPrice])}
                            />
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default FilterSearchBar;
