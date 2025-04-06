interface PortfolioItem {
    id: string | number;
    type: 'portfolio';
    coin: CryptoCurrency;
    price: number;
    quantity: number;
}
