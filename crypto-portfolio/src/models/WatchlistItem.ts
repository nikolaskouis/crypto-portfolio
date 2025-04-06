interface WatchlistItem {
    id: string | number;
    type: 'watchlist';
    coin: CryptoCurrency;
    selected: boolean;
}
