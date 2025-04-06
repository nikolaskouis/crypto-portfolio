const API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptos = async (page: number = 1, perPage: number = 20) => {
    const res = await fetch(
        `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}`,
        {
            next: { revalidate: 60 },
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch cryptos: ${res.statusText}`);
    }

    return res.json();
};

export const getCrypto = async (cryptoId: string) => {
    const res = await fetch(`${API_URL}/coins/${cryptoId}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch crypto detail: ${res.statusText}`);
    }

    return res.json();
};

export const fetchGraph = async (cryptoId: string, days: string) => {
    const res = await fetch(
        `${API_URL}/coins/${cryptoId}/ohlc?vs_currency=usd&days=${days}`,
        {
            next: { revalidate: 60 },
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch crypto graph data: ${res.statusText}`);
    }

    return res.json();
};
