import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    Paper,
    CircularProgress,
    Button
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import {formatLargeNumber, formatPriceChangePercent} from "@/utils/formaters";
import {useTheme} from "@mui/system";
import FilterSearchBar from "@/components/Search/FilterSearchBar";

const CryptoList = ({ cryptos, setPage, loading, setLoading, onRowClick }: { cryptos: Crypto[], setPage: React.Dispatch<React.SetStateAction<number>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>>, onRowClick: (id:string) => void }) => {
    const theme = useTheme(); // custom theme
    const [search, setSearch] = useState("");
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

    // Get visible items with a placeholder for estimated total height
    const getVisibleItems = () => {
        const [start, end] = visibleRange;
        const visibleItems = sortedCryptos.slice(start, end);

        // Calculate heights for virtualized scrolling
        const totalHeight = sortedCryptos.length * 53; // 53px apprx
        const startOffset = start * 53;

        return { visibleItems, totalHeight, startOffset };
    };

    const handleWatchList = (cryptoData: Crypto) => {
        console.log("watch list: " + cryptoData.name);
        //TODO: Add this to wallet dispatch
    }

    const { visibleItems, totalHeight, startOffset } = getVisibleItems();

    return (
        <Container maxWidth="lg" sx={{paddingBottom: "1rem", paddingTop: "1rem"}}>
            <Paper
                sx={{
                    p: 2,
                    mb: 4,
                    mt: 2,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                }}
                elevation={4}
            >
                <FilterSearchBar
                    cryptos={sortedCryptos}
                    setSortConfig={setSortConfig}
                    sortConfig={sortConfig}
                    setPerformanceFilter={setPerformanceFilter}
                    search={search}
                    setSearch={setSearch}
                    performanceFilter={performanceFilter}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    setMarketCapFilter={setMarketCapFilter}
                    marketCapFilter={marketCapFilter}
                />

                {/* Showing Count */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Showing {sortedCryptos.length} out of {cryptos.length} cryptocurrencies
                </Typography>
            </Paper>
            {/* Cryptocurrency Table */}
            <Paper sx={{ mb: 4, borderRadius: 3, overflowY: "auto", maxHeight: "400px" }} elevation={4} ref={listRef}>
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
                                {visibleItems.map((crypto: Crypto) => (
                                    <TableRow
                                        key={crypto.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                cursor: 'pointer',
                                            }
                                        }}
                                        onClick={() => onRowClick(crypto.id)}
                                    >
                                        <TableCell>
                                            <StarIcon style={{ marginRight: '8px', cursor: 'pointer' }} onClick={(e) => {
                                                e.stopPropagation(); // Prevent navigation on star click
                                                handleWatchList(crypto);
                                            }} />
                                            {crypto.name}
                                        </TableCell>
                                        <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                                        <TableCell>${crypto.current_price.toLocaleString()}</TableCell>
                                        <TableCell>{formatLargeNumber(crypto.market_cap)}</TableCell>
                                        <TableCell>{formatPriceChangePercent(crypto.price_change_percentage_24h)}</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
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
