'use client';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addToPortfolio, addToWatchlist } from '@/redux/portfolioSlice';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { fetchGraph, getCrypto } from '@/services/api';
import CryptoDetailSkeleton from './CryptoDetailSkeleton';
import { formatLargeNumber, formatNumberWithCommas } from '@/utils/formaters';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { selectWatchlistItems } from '@/redux/portfolioSelectors';

dayjs.extend(utc);
dayjs.extend(timezone);

const FinancialChart = dynamic(
    () =>
        import('igniteui-react-charts').then((mod) => {
            const { IgrFinancialChart, IgrFinancialChartModule } = mod;
            IgrFinancialChartModule.register();
            return IgrFinancialChart;
        }),
    { ssr: false }
);

interface CryptoDetailProps {
    cryptoId: string;
}

interface MarketChartData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

type TimeframeKey =
    | '1 Day'
    | '7 Days'
    | '2 Weeks'
    | '1 Month'
    | '3 Months'
    | '6 Months'
    | 'This Year'
    | 'Max';

const CryptoDetail = ({ cryptoId }: CryptoDetailProps) => {
    const [cryptoData, setCryptoData] = useState<CryptoCurrency>();
    const [marketChartData, setMarketChartData] = useState<MarketChartData[]>(
        []
    );
    const [showCoinAnimation, setShowCoinAnimation] = useState(false);
    const [watchList, setWatchList] = useState<boolean>(useSelector(selectWatchlistItems));
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingChart, setLoadingChart] = useState<boolean>(true);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackBarValue, setSnackBarValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedTimeframe, setSelectedTimeframe] =
        useState<TimeframeKey>('1 Month');
    const [processedData, setProcessedData] = useState<ProcessedCryptoData>({
        name: '',
        symbol: '',
        image: '/placeholder.png',
        price: 0,
        priceFormatted: '0.00 USD',
        priceChangeSign: '+',
        priceChange24h: '0.00%',
        priceChangeColor: 'text.secondary',
        marketCap: '0',
        marketCapChange24h: '0.00%',
        marketCapChange24hColor: 'text.secondary',
        volMktCapRatio: '0.00%',
        fullyDilutedValue: '0',
        totalSupply: '0',
        maxSupply: '0',
        circulatingSupply: '0',
        percentageOfMaxSupply: '0.00%',
        chartData: [],
    });

    const timeframes: Record<TimeframeKey, string> = {
        '1 Day': '1',
        '7 Days': '7',
        '2 Weeks': '14',
        '1 Month': '30',
        '3 Months': '90',
        '6 Months': '180',
        'This Year': '365',
        Max: 'max',
    };

    const dispatch = useDispatch();

    useEffect(() => {
        if (!cryptoId) return;

        const fetchCryptoDetails = async () => {
            setLoading(true);
            try {
                const data = await getCrypto(cryptoId);
                setCryptoData(data);
            } catch (err) {
                setError(`Failed to fetch cryptocurrency Details. ${err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoDetails();
    }, [cryptoId]);

    useEffect(() => {
        if (!cryptoId) return;

        const fetchMarketChart = async () => {
            setLoadingChart(true);
            try {
                const days =
                    timeframes[selectedTimeframe as keyof typeof timeframes];
                const data = await fetchGraph(cryptoId, days);
                const formattedData: MarketChartData[] = data.map(
                    (d: number[]) => ({
                        timestamp: d[0],
                        open: d[1],
                        high: d[2],
                        low: d[3],
                        close: d[4],
                    })
                );
                setMarketChartData(formattedData);
            } catch (err) {
                setError(`Failed to fetch market chart data. ${err}`);
            } finally {
                setLoadingChart(false);
            }
        };

        fetchMarketChart();
    }, [cryptoId, selectedTimeframe]);

    useEffect(() => {
        if (
            !loading &&
            !loadingChart &&
            cryptoData &&
            marketChartData.length > 0
        ) {
            const processedData = processCryptoData(
                cryptoData,
                marketChartData
            );
            setProcessedData(processedData);
        }
    }, [loading, loadingChart, cryptoData, marketChartData]);

    //Instead of taking CryptoCurrency object, formatted objects to look better in a model
    const processCryptoData = (
        cryptoData: CryptoCurrency,
        marketChartData: MarketChartData[]
    ) => {
        if (!cryptoData) {
            return {
                name: '',
                symbol: '',
                image: '/placeholder.png',
                price: 0,
                priceFormatted: '0.00 USD',
                priceChangeSign: '+',
                priceChange24h: '0.00%',
                priceChangeColor: 'text.secondary',
                marketCap: '0',
                marketCapChange24h: '0.00%',
                marketCapChange24hColor: 'text.secondary',
                volMktCapRatio: '0.00%',
                fullyDilutedValue: '0',
                totalSupply: '0',
                maxSupply: '0',
                circulatingSupply: '0',
                percentageOfMaxSupply: '0.00%',
                chartData: [],
            };
        }

        const symbol = cryptoData.symbol || '';
        const price = cryptoData.tickers?.[0]?.last || 0;
        const marketCap = cryptoData.market_data?.market_cap?.[symbol] || 0;
        const totalVolume = cryptoData.market_data?.total_volume?.[symbol] || 0;
        const totalSupply = cryptoData.market_data?.total_supply || 0;
        const maxSupply = cryptoData.market_data?.max_supply || 0;
        const circulatingSupply =
            cryptoData.market_data?.circulating_supply || 0;
        const priceChange24h =
            cryptoData.market_data?.price_change_percentage_24h || 0;
        const marketCapChange24h =
            cryptoData.market_data?.market_cap_change_percentage_24h || 0;

        let marketCapPrice = 0;

        if (circulatingSupply > 0) {
            marketCapPrice = price * circulatingSupply;
        }

        // Calculate derived values
        const volMktCapRatio =
            marketCap > 0 ? (totalVolume / marketCap) * 100 : 0;
        const percentageInSupply =
            maxSupply > 0
                ? ((maxSupply - circulatingSupply) * 100) / maxSupply
                : 0;
        const fullyDilutedValue = price * totalSupply;

        // Format values for display
        return {
            name: cryptoData.name || '',
            symbol,
            image: cryptoData.image?.small || '/bitcoin-logo.png',
            price: price,
            priceFormatted: `${price.toFixed(2)} USD`,
            priceChangeSign: priceChange24h >= 0 ? '+' : '-',
            priceChange24h: `${Math.abs(priceChange24h).toFixed(2)}%`,
            priceChangeColor:
                priceChange24h >= 0 ? 'success.main' : 'error.main',
            marketCap: formatLargeNumber(marketCapPrice),
            marketCapChange24h: `${marketCapChange24h.toFixed(2)}%`,
            marketCapChange24hColor:
                marketCapChange24h >= 0 ? 'success.main' : 'error.main',
            volMktCapRatio: `${volMktCapRatio.toFixed(2)}%`,
            fullyDilutedValue: formatLargeNumber(fullyDilutedValue),
            totalSupply: formatLargeNumber(totalSupply),
            maxSupply: formatLargeNumber(maxSupply),
            circulatingSupply: formatLargeNumber(circulatingSupply),
            percentageOfMaxSupply: `${(100 - percentageInSupply).toFixed(2)}%`,
            chartData: marketChartData.map((d) => ({
                date: new Date(d.timestamp),
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            })),
        };
    };

    const triggerCoinAnimation = () => {
        setShowCoinAnimation(true);
        setTimeout(() => setShowCoinAnimation(false), 1000); // duration
    };

    const toggleWatchList = () => {
        setWatchList(!watchList);
    };

    const handleSnackBar = (value: string) => {
        setOpenSnackbar(false);
        if (cryptoData) {
            if (value.toLowerCase().includes('watchlist')) {
                const data: WatchlistItem = {
                    id: cryptoData.name,
                    type: 'watchlist',
                    coin: cryptoData,
                    selected: !watchList,
                };
                dispatch(addToWatchlist(data));
            } else {
                const data: PortfolioItem = {
                    id: cryptoData.name,
                    type: 'portfolio',
                    coin: cryptoData,
                    price: processedData.price,
                    quantity: 1, //hardcoded
                };
                dispatch(addToPortfolio(data));
            }
            setSnackBarValue(value);
            setOpenSnackbar(true);
        }
    };

    //Made custom skeleton for the loading
    if (loading || error) {
        return (
            <Box
                data-testid="crypto-detail-skeleton"
                sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}
            >
                <CryptoDetailSkeleton />
                <Snackbar open={Boolean(error)} onClose={() => setError('')}>
                    <Alert onClose={() => setError('')} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }

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
                <Box display="flex">
                    <Button
                        aria-label={
                            watchList
                                ? 'remove from watchlist'
                                : 'add to watchlist'
                        }
                        sx={{ color: 'text.primary' }}
                        onClick={() => {
                            handleSnackBar('watchlist');
                            toggleWatchList();
                        }}
                    >
                        {' '}
                        {watchList ? <StarIcon /> : <StarBorderIcon />}
                    </Button>
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
                        <Box
                            component="img"
                            src={
                                cryptoData?.image?.small || '/bitcoin-logo.png'
                            }
                            alt={cryptoData?.symbol}
                            width={32}
                            height={32}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                        >
                            {processedData.name}
                        </Typography>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mt={0.5}
                        >
                            <Typography
                                variant="body1"
                                color={processedData.priceChangeColor}
                                fontWeight="bold"
                            >
                                {processedData.priceChangeSign}{' '}
                                {processedData.priceChange24h}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                ({selectedTimeframe})
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Price Header */}
            <Box mb={3}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Grid>
                        <Typography
                            variant="h3"
                            component="p"
                            fontWeight="bold"
                        >
                            {formatNumberWithCommas(processedData.price)} USD
                        </Typography>
                    </Grid>
                    <Grid>
                        {/*Coin Animation when clicking*/}
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                handleSnackBar('portfolio');
                                triggerCoinAnimation();
                            }}
                            style={{ position: 'relative' }}
                        >
                            <Button
                                data-testid="buy-button"
                                variant="contained"
                                color="secondary"
                                sx={{ borderRadius: 28 }}
                                fullWidth
                            >
                                Buy {processedData?.symbol}
                            </Button>

                            {showCoinAnimation && (
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{
                                                y: 0,
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            animate={{
                                                y: -100 - Math.random() * 50,
                                                opacity: 0,
                                                scale: 1.5,
                                                x: (Math.random() - 0.5) * 100,
                                            }}
                                            transition={{
                                                duration: 1,
                                                ease: 'easeOut',
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontSize: '1.5rem',
                                                pointerEvents: 'none',
                                                zIndex: 10,
                                            }}
                                        >
                                            🪙
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>

            {/* Key Stats Grid */}
            <Grid container spacing={2} mb={4}>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Market cap
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.marketCap}
                        </Typography>
                        <Typography
                            variant="body2"
                            color={processedData?.marketCapChange24hColor}
                        >
                            {processedData?.marketCapChange24h}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Vol/Mkt Cap (24h)
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.volMktCapRatio}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            FDV
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.fullyDilutedValue}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Total supply
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.totalSupply} {processedData?.symbol}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Max supply
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.maxSupply}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Circulating supply
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {processedData?.circulatingSupply}{' '}
                            {processedData?.symbol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {processedData?.percentageOfMaxSupply} of max supply
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Chart Section */}
            <Box mb={4}>
                {/* Time Frame Selector */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ overflowX: 'auto', mb: 3 }}
                >
                    {Object.keys(timeframes).map((time) => (
                        <Chip
                            key={time}
                            label={time}
                            onClick={() =>
                                setSelectedTimeframe(time as TimeframeKey)
                            }
                            variant={
                                selectedTimeframe === time
                                    ? 'filled'
                                    : 'outlined'
                            }
                            sx={{
                                borderRadius: 1,
                                backgroundColor:
                                    selectedTimeframe === time
                                        ? 'secondary.main'
                                        : 'transparent',
                                color:
                                    selectedTimeframe === time
                                        ? 'white'
                                        : 'inherit',
                            }}
                        />
                    ))}
                </Stack>

                {/* Chart Display */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        {loadingChart ? (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="100%"
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <FinancialChart
                                width="100%"
                                height="100%"
                                chartType="Candle"
                                yAxisMode="PercentChange"
                                dataSource={marketChartData.map((d) => ({
                                    date: new Date(d.timestamp),
                                    open: d.open,
                                    high: d.high,
                                    low: d.low,
                                    close: d.close,
                                }))}
                                overlayBrushes={['rgba(95, 160, 235, 0.5)']}
                                overlayOutlines={['rgba(55, 120, 195, 1)']}
                            />
                        )}
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                >
                    Added to {snackBarValue}!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CryptoDetail;
