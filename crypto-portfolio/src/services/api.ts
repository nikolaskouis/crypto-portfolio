import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptos = async (page: number = 1, perPage: number = 20) => {
    const response = await axios.get(`${API_URL}/coins/markets`, {
        params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: perPage,
            page: page
        },
    });
    return response.data;
};

export const getCrypto = async (cryptoId: string) => {
    const response = await axios.get(`${API_URL}/coins/${cryptoId}`,);
    return response.data;
};

export const fetchGraph = async (cryptoId: string, days: string) => {
    const response = await axios.get(`${API_URL}/coins/${cryptoId}/ohlc?vs_currency=usd&days=${days}`,);
    return response.data;
};