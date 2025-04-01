"use client"
import React, {useEffect, useRef, useState, useCallback} from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    TableSortLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Slider,
    Typography,
    Box,
    Chip,
    Paper,
    CircularProgress, Button
} from "@mui/material";
import Link from "next/link";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

const CryptoList = ({ cryptos, setPage, loading, setLoading }: { cryptos: Crypto[], setPage: React.Dispatch<React.SetStateAction<number>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Crypto; direction: "asc" | "desc" } | null>(null);
    const [marketCapFilter, setMarketCapFilter] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [performanceFilter, setPerformanceFilter] = useState<string>("all");
    const listRef = useRef<HTMLDivElement | null>(null);
    const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 20]);
    const marketCapCategories = {
        all: 0,
        small: 1000000000, // $1 Billiob
        medium: 10000000000, // $10 Billion
        large: 50000000000, // $50 Billion
    };
    const maxPrice = Math.max(...cryptos.map(crypto => crypto.current_price));


    // Function to detect when the list is scrolled to the bottom
    const handleScroll = useCallback(() => {
        if (listRef.current) {
            const scrollPosition = listRef.current.scrollTop + listRef.current.clientHeight;
            const bottomPosition = listRef.current.scrollHeight;

            if (scrollPosition >= bottomPosition - 50 && !loading) {
                // Trigger next page load
                setLoading(true);
                setPage((prevPage) => prevPage + 1);
            }

            const rowHeight = 53; // Approximate height of each row in pixels
            const containerHeight = listRef.current.clientHeight;
            const scrollTop = listRef.current.scrollTop;

            const buffer = 10;
            const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
            const visibleCount = Math.ceil(containerHeight / rowHeight) + (buffer * 2);

            setVisibleRange([startIndex, startIndex + visibleCount]);
        }
    }, [loading, setLoading, setPage]);

    useEffect(() => {
        const currentRef = listRef.current;
        currentRef?.addEventListener("scroll", handleScroll);

        handleScroll();

        // Cleanup
        return () => {
            currentRef?.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    const handleSort = (key: keyof Crypto) => {
        setSortConfig((prev) => ({
            key,
            direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as [number, number]);
    };

    // Main Filtering
    const filteredCryptos = cryptos.filter((crypto) => {
        // Search filter
        const matchesSearch =
            crypto.name.toLowerCase().includes(search.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(search.toLowerCase());

        // Market cap filter
        const matchesMarketCap =
            marketCapFilter === "all" ||
            (marketCapFilter === "small" && crypto.market_cap < marketCapCategories.medium) ||
            (marketCapFilter === "medium" && crypto.market_cap >= marketCapCategories.medium && crypto.market_cap < marketCapCategories.large) ||
            (marketCapFilter === "large" && crypto.market_cap >= marketCapCategories.large);

        // Price range filter
        const matchesPriceRange =
            crypto.current_price >= priceRange[0] &&
            crypto.current_price <= priceRange[1];

        // Performance filter
        const matchesPerformance =
            performanceFilter === "all" ||
            (performanceFilter === "positive" && crypto.price_change_percentage_24h > 0) ||
            (performanceFilter === "negative" && crypto.price_change_percentage_24h < 0);

        return matchesSearch && matchesMarketCap && matchesPriceRange && matchesPerformance;
    });

    // Sort cryptocurrencies
    const sortedCryptos = [...filteredCryptos].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const valueA = a[key];
        const valueB = b[key];

        if (typeof valueA === "string" && typeof valueB === "string") {
            return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else if (typeof valueA === "number" && typeof valueB === "number") {
            return direction === "asc" ? valueA - valueB : valueB - valueA;
        }
        return 0;
    });

    //TODO: Add Formats to utils

    // Format price + change color, red/green
    const formatPriceChange = (change: number) => {
        const color = change >= 0 ? "success.main" : "error.main";
        const sign = change >= 0 ? "+" : "";
        return <Typography sx={{ color }}>{sign}{change?.toFixed(2)}%</Typography>;
    };

    // Format large numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000000) {
            return `$${(num / 1000000000).toFixed(2)}B`;
        } else if (num >= 1000000) {
            return `$${(num / 1000000).toFixed(2)}M`;
        } else {
            return `$${num?.toLocaleString()}`;
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        setMarketCapFilter("all");
        setPriceRange([0, maxPrice]);
        setPerformanceFilter("all");
        setSortConfig(null);
    };

    // Get visible items with a placeholder for estimated total height
    const getVisibleItems = () => {
        const [start, end] = visibleRange;
        const visibleItems = sortedCryptos.slice(start, end);

        // Calculate heights for virtualized scrolling
        const totalHeight = sortedCryptos.length * 53; // 53px apprx
        const startOffset = start * 53;

        return { visibleItems, totalHeight, startOffset };
    };

    const { visibleItems, totalHeight, startOffset } = getVisibleItems();

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 2, mb: 4, mt: 2 }} elevation={2}>
                <Typography variant="h4" gutterBottom>Cryptocurrency List</Typography>

                {/* Search */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    {/* Search Field */}
                    <Grid item sx={{ width: '90%' }}>
                        <TextField
                            fullWidth
                            label="Search Cryptocurrency"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>

                    {/* Filter Button */}
                    <Grid item sx={{ width: '5%' }}>
                        <Button
                            variant={!showFilter ? "outlined" : "contained"}
                            color="primary"
                            onClick={() => { setShowFilter(!showFilter); }}
                            fullWidth
                        ><FilterListIcon /></Button>
                    </Grid>
                </Grid>

                {showFilter &&
                    <>
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            {/* Market Cap Filter */}
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Market Cap</InputLabel>
                                    <Select
                                        value={marketCapFilter}
                                        label="Market Cap"
                                        onChange={(e) => setMarketCapFilter(e.target.value)}
                                    >
                                        <MenuItem value="all">All Market Caps</MenuItem>
                                        <MenuItem value="small">Small Cap (&lt; $10B)</MenuItem>
                                        <MenuItem value="medium">Mid Cap ($10B - $50B)</MenuItem>
                                        <MenuItem value="large">Large Cap (&gt; $50B)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 24h Performance Filter */}
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>24h Performance</InputLabel>
                                    <Select
                                        value={performanceFilter}
                                        label="24h Performance"
                                        onChange={(e) => setPerformanceFilter(e.target.value)}
                                    >
                                        <MenuItem value="all">All Performance</MenuItem>
                                        <MenuItem value="positive">Positive (+)</MenuItem>
                                        <MenuItem value="negative">Negative (-)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box>
                                    <Typography gutterBottom>Price Range</Typography>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceRangeChange}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={maxPrice}
                                        valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                                    />
                                    <Grid container>
                                        <Grid item>
                                            <Typography variant="body2" color="text.secondary">
                                                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Clear Filters Button */}
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    label="Clear All Filters"
                                    onClick={clearFilters}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ ml: 'auto' }}
                                />
                            </Grid>
                        </Grid>

                        {/* Active Filters Display */}
                        {(search || marketCapFilter !== "all" || performanceFilter !== "all" || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Active Filters:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {search && <Chip size="small" label={`Search: ${search}`} onDelete={() => setSearch("")} />}
                                    {marketCapFilter !== "all" && (
                                        <Chip
                                            size="small"
                                            label={`Market Cap: ${marketCapFilter}`}
                                            onDelete={() => setMarketCapFilter("all")}
                                        />
                                    )}
                                    {performanceFilter !== "all" && (
                                        <Chip
                                            size="small"
                                            label={`Performance: ${performanceFilter}`}
                                            onDelete={() => setPerformanceFilter("all")}
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
                }
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Showing {sortedCryptos.length} out of {cryptos.length} cryptocurrencies
                </Typography>
            </Paper>

            {/* Cryptocurrency Table */}
            <Paper sx={{ mb: 4, overflowY: "auto", maxHeight: "400px" }} elevation={2} ref={listRef}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="cryptocurrency table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === "name"}
                                    direction={sortConfig?.key === "name" ? sortConfig.direction : "asc"}
                                    onClick={() => handleSort("name")}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === "symbol"}
                                    direction={sortConfig?.key === "symbol" ? sortConfig.direction : "asc"}
                                    onClick={() => handleSort("symbol")}
                                >
                                    Symbol
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === "current_price"}
                                    direction={sortConfig?.key === "current_price" ? sortConfig.direction : "asc"}
                                    onClick={() => handleSort("current_price")}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === "market_cap"}
                                    direction={sortConfig?.key === "market_cap" ? sortConfig.direction : "asc"}
                                    onClick={() => handleSort("market_cap")}
                                >
                                    Market Cap
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === "price_change_percentage_24h"}
                                    direction={sortConfig?.key === "price_change_percentage_24h" ? sortConfig.direction : "asc"}
                                    onClick={() => handleSort("price_change_percentage_24h")}
                                >
                                    24h %
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCryptos.length > 0 ? (
                            <>
                                {/* Spacer */}
                                {startOffset > 0 && (
                                    <tr style={{ height: `${startOffset}px` }} />
                                )}

                                {/* Only render visible items */}
                                {visibleItems.map((crypto) => (
                                    <TableRow key={crypto.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            {crypto.name}
                                            <Link href={`/crypto/${crypto.id}`}>
                                                <AddIcon style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                                        <TableCell>${crypto.current_price.toLocaleString()}</TableCell>
                                        <TableCell>{formatNumber(crypto.market_cap)}</TableCell>
                                        <TableCell>{formatPriceChange(crypto.price_change_percentage_24h)}</TableCell>
                                    </TableRow>
                                ))}

                                {/* Spacer for remaining height */}
                                {startOffset + visibleItems.length * 53 < totalHeight && (
                                    <tr style={{ height: `${totalHeight - (startOffset + visibleItems.length * 53)}px` }} />
                                )}
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" sx={{ py: 2 }}>
                                        No cryptocurrencies match your filters
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Loading more...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default CryptoList;