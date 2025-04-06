// src/lib/getInitialCryptos.ts
import { fetchCryptos } from '@/services/api';

export async function getInitialCryptos() {
    try {
        return await fetchCryptos(1, 20);
    } catch (err) {
        console.error('SSR Fetch error', err);
        return [];
    }
}
