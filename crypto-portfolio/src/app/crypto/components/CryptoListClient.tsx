'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    Alert,
    Snackbar,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { formatLargeNumber, formatPriceChangePercent } from '@/utils/formaters';
import { useTheme } from '@mui/system';
import FilterSearchBar from '@/components/Search/FilterSearchBar';
import { listUnderlineEffect } from '@/utils/animations';
import { useSelector } from 'react-redux';
import { selectWatchlistItems } from '@/redux/portfolioSelectors';
import { useRouter } from 'next/navigation';
import { fetchCryptos } from '@/services/api';

interface CryptoListClientProps {
    initialCryptos: Crypto[];
}

export default function CryptoListClient({
    initialCryptos,
}: CryptoListClientProps) {
    const theme = useTheme(); // custom theme
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Crypto;
        direction: 'asc' | 'desc';
    } | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [cryptos, setCryptos] = useState<Crypto[]>(() => initialCryptos);
    const [filteredCryptos, setFilteredCrypto] = useState<Crypto[]>(
        () => initialCryptos
    );
    const [page, setPage] = useState(2); // already fetched page 1 on SSR
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const watchListItems = useSelector(selectWatchlistItems);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    setIsFetching(true);
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, isFetching]);

    useEffect(() => {
        const fetchMoreCryptos = async () => {
            try {
                const newCryptos = await fetchCryptos(page, 20);
                if (newCryptos.length < 20) setHasMore(false);
                setCryptos((prev) => [...prev, ...newCryptos]);
                setFilteredCrypto((prev) => [...prev, ...newCryptos]);
            } catch (error) {
                console.error('Error fetching more cryptos:', error);
                setError(`Error fetching more cryptos: ${error}`);
                setHasMore(false);
            } finally {
                setIsFetching(false);
            }
        };
        if (page > 1) fetchMoreCryptos();
    }, [page]);

    useEffect(() => {
        setCryptos(initialCryptos);
        setFilteredCrypto(initialCryptos);
    }, [initialCryptos]);

    const watchListSet = useMemo(() => {
        return new Set(
            watchListItems
                .filter((item: WatchlistItem) => item.selected)
                .map((item: WatchlistItem) => item.coin.name)
        );
    }, [watchListItems]);

    const navigateToDetails = (id: string) => {
        router.push(`/crypto/${id}`);
    };

    const handleSort = (key: keyof Crypto) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // Sort cryptocurrencies
    const sortedCryptos = [...filteredCryptos].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const valueA = a[key];
        const valueB = b[key];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
            return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }
        return 0;
    });

    return (
        <Container
            maxWidth="lg"
            sx={{ paddingBottom: '1rem', paddingTop: '1rem' }}
        >
            <Paper
                sx={{
                    p: 2,
                    mb: 4,
                    mt: 2,
                    borderRadius: 3,
                    backgroundColor:
                        theme?.palette?.background?.paper ?? '#fff',
                }}
                elevation={4}
            >
                <FilterSearchBar
                    cryptos={cryptos}
                    setFilteredCrypto={setFilteredCrypto}
                    setSortConfig={setSortConfig}
                    sortConfig={sortConfig}
                    search={search}
                    setSearch={setSearch}
                />

                {/* Showing Count */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Showing {filteredCryptos.length} out of {cryptos.length}{' '}
                    cryptocurrencies
                </Typography>
            </Paper>
            {/* Cryptocurrency Table */}
            <Paper
                sx={{
                    mb: 4,
                    borderRadius: 3,
                    overflowY: 'auto',
                    maxHeight: '400px',
                    backgroundColor:
                        theme?.palette?.background?.paper ?? '#fff',
                }}
                elevation={4}
                ref={listRef}
            >
                <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="cryptocurrency table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    sx={{ fontWeight: 'bold' }}
                                    active={sortConfig?.key === 'name'}
                                    direction={
                                        sortConfig?.key === 'name'
                                            ? sortConfig.direction
                                            : 'asc'
                                    }
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    sx={{ fontWeight: 'bold' }}
                                    active={sortConfig?.key === 'symbol'}
                                    direction={
                                        sortConfig?.key === 'symbol'
                                            ? sortConfig.direction
                                            : 'asc'
                                    }
                                    onClick={() => handleSort('symbol')}
                                >
                                    Symbol
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    sx={{ fontWeight: 'bold' }}
                                    active={sortConfig?.key === 'current_price'}
                                    direction={
                                        sortConfig?.key === 'current_price'
                                            ? sortConfig.direction
                                            : 'asc'
                                    }
                                    onClick={() => handleSort('current_price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    sx={{ fontWeight: 'bold' }}
                                    active={sortConfig?.key === 'market_cap'}
                                    direction={
                                        sortConfig?.key === 'market_cap'
                                            ? sortConfig.direction
                                            : 'asc'
                                    }
                                    onClick={() => handleSort('market_cap')}
                                >
                                    Market Cap
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    sx={{ fontWeight: 'bold' }}
                                    active={
                                        sortConfig?.key ===
                                        'price_change_percentage_24h'
                                    }
                                    direction={
                                        sortConfig?.key ===
                                        'price_change_percentage_24h'
                                            ? sortConfig.direction
                                            : 'asc'
                                    }
                                    onClick={() =>
                                        handleSort(
                                            'price_change_percentage_24h'
                                        )
                                    }
                                >
                                    24h %
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCryptos.length > 0 ? (
                            <>
                                {sortedCryptos.map((crypto: Crypto, index) => (
                                    <TableRow
                                        key={`${crypto.name}-${index}`}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 },
                                            '&:hover': {
                                                cursor: 'pointer',
                                            },
                                            ...listUnderlineEffect,
                                        }}
                                        onClick={() =>
                                            navigateToDetails(crypto.id)
                                        }
                                    >
                                        <TableCell>
                                            {watchListSet.has(crypto.name) ? (
                                                <StarIcon />
                                            ) : (
                                                <StarBorderIcon />
                                            )}
                                            {crypto.name}
                                        </TableCell>
                                        <TableCell>
                                            {crypto.symbol.toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            $
                                            {crypto.current_price.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {formatLargeNumber(
                                                crypto.market_cap
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatPriceChangePercent(
                                                crypto.price_change_percentage_24h
                                            )}
                                        </TableCell>
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
                        {hasMore && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <div
                                        ref={loaderRef}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                        }}
                                    >
                                        <CircularProgress data-testid="loading-spinner" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {error && (
                    <Snackbar
                        open={Boolean(error)}
                        onClose={() => setError('')}
                    >
                        <Alert onClose={() => setError('')} severity="error">
                            {error}
                        </Alert>
                    </Snackbar>
                )}
            </Paper>
        </Container>
    );
}
