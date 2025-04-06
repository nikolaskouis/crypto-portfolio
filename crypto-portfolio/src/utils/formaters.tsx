import { Typography } from '@mui/material';

// Format price + change color, red/green
export const formatPriceChangePercent = (change: number) => {
    const color = change >= 0 ? 'success.main' : 'error.main';
    const sign = change >= 0 ? '+' : '';
    return (
        <Typography sx={{ color }}>
            {sign}
            {change?.toFixed(2)}%
        </Typography>
    );
};

export const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000_000_000) {
        return `${(value / 1_000_000_000_000).toFixed(2)}T`;
    } else if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
    }
    return value.toString();
};

export const formatNumberWithCommas = (value: number): string => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
