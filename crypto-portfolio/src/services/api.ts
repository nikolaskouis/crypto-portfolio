import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptos = async () => {
    const response = await axios.get(`${API_URL}/coins/markets`, {
        params: { vs_currency: "usd", order: "market_cap_desc", per_page: 20 },
    });
    return response.data;
};
