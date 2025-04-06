// app/crypto/page.tsx
import React from 'react';
import CryptoListClient from './components/CryptoListClient';
import { fetchCryptos } from '@/services/api';

export default async function CryptoPage() {
    let cryptos: Crypto[] = [];

    try {
        cryptos = await fetchCryptos(1, 20); // Server-side fetch for SSR
    } catch (err) {
        console.error('SSR Fetch error', err);
    }

    return <CryptoListClient initialCryptos={cryptos} />;
}
