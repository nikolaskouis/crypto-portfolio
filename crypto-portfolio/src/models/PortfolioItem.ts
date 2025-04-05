interface PortfolioItem {
    id: string | number;
    type: 'portfolio';
    coin: CryptoCurrency;
    price: string;
    quantity: number;
}