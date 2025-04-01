"use client";
import { useEffect, useState } from 'react';
import { Button, Card, Snackbar, CircularProgress, Alert, Typography, Box, Stack, Grid, useMediaQuery, Theme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToPortfolio } from '@/redux/portfolioSlice';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


const FinancialChart = dynamic(
    () => import('igniteui-react-charts').then((mod) => {
        const { IgrFinancialChart, IgrFinancialChartModule } = mod;
        IgrFinancialChartModule.register();
        return IgrFinancialChart;
    }),
    { ssr: false }
);

dayjs.extend(utc);
dayjs.extend(timezone);

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

const CryptoDetail = ({ cryptoId }: CryptoDetailProps) => {
    const [cryptoData, setCryptoData] = useState<any>(null);
    const [marketChartData, setMarketChartData] = useState<MarketChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingChart, setLoadingChart] = useState<boolean>(true);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!cryptoId) return;

        const fetchCryptoDetails = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
                const data = await response.json();
                setCryptoData(data);
            } catch (err) {
                setError('Failed to fetch cryptocurrency details');
            } finally {
                setLoading(false);
            }
        };

        const fetchMarketChart = async () => {
            setLoadingChart(true);
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?vs_currency=usd&days=30`
                );
                const data = await response.json();
                const formattedData: MarketChartData[] = data.map((d: number[]) => ({
                    timestamp: d[0],
                    open: d[1],
                    high: d[2],
                    low: d[3],
                    close: d[4],
                }));
                setMarketChartData(formattedData);
            } catch (err) {
                setError('Failed to fetch market chart data');
            } finally {
                setLoadingChart(false);
            }
        };

        fetchCryptoDetails();
        fetchMarketChart();
    }, [cryptoId]);

    const handleAddToPortfolio = () => {
        if (cryptoData) {
            dispatch(addToPortfolio(cryptoData));
            setOpenSnackbar(true);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <Stack direction="column" alignItems="center" spacing={2} className="mb-8">
                    <Typography variant="h3" fontWeight="bold">
                        {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
                    </Typography>
                    <Typography variant="h6"><strong>Price:</strong> ${cryptoData.market_data?.current_price?.usd}</Typography>
                    <Typography variant="h6"><strong>Market Cap:</strong> ${cryptoData.market_data?.market_cap?.usd}</Typography>
                    <Typography variant="h6"><strong>24h Change:</strong> {cryptoData.market_data?.price_change_percentage_24h?.toFixed(2)}%</Typography>
                    <Typography variant="h6"><strong>Volume:</strong> ${cryptoData.market_data?.total_volume?.usd}</Typography>
                    <Button variant="contained" color="primary" onClick={handleAddToPortfolio} disabled={!cryptoData}>
                        Add to Portfolio
                    </Button>
                </Stack>
            </Card>

            <Box className="mb-8" height={400}>
                <Typography variant="h6" gutterBottom>
                    Price Chart (Last 30 Days)
                </Typography>
                {loadingChart ? (
                    <div className="flex justify-center items-center py-16">
                        <CircularProgress size={30} />
                    </div>
                ) : (
                    <FinancialChart
                        width="100%"
                        height="400px"
                        chartType="Candle"
                        yAxisMode="PercentChange"
                        dataSource={marketChartData.map(d => ({
                            date: new Date(d.timestamp),
                            open: d.open,
                            high: d.high,
                            low: d.low,
                            close: d.close
                        }))}
                        overlayBrushes={["rgba(95, 160, 235, 0.5)"]}
                        overlayOutlines={["rgba(55, 120, 195, 1)"]}
                    />
                )}
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Added to Portfolio!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CryptoDetail;