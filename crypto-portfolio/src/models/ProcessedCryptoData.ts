interface ProcessedCryptoData {
    name: string;
    symbol: string;
    image: string;
    price: number;
    priceFormatted: string;
    priceChangeSign: string;
    priceChange24h: string;
    priceChangeColor: string;
    marketCap: string;
    marketCapChange24h: string;
    marketCapChange24hColor: string;
    volMktCapRatio: string;
    fullyDilutedValue: string;
    totalSupply: string;
    maxSupply: string;
    circulatingSupply: string;
    percentageOfMaxSupply: string;
    chartData: {
        date: Date;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
}