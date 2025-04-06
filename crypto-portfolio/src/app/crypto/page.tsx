// app/crypto/page.tsx
import React from 'react';
import CryptoListClient from './components/CryptoListClient';
import { getInitialCryptos } from '@/lib/getInitialCryptos';

export default async function CryptoPage() {
    const cryptos = await getInitialCryptos();
    return <CryptoListClient initialCryptos={cryptos} />;
}
