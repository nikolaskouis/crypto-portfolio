'use client';
import React, { useEffect, useState } from 'react';
import { fetchCryptos } from '@/services/api';
import CryptoListClient from '@/app/crypto/components/CryptoListClient';

export default function CryptoListSection() {
    const [cryptos, setCryptos] = useState<Crypto[]>([]);

    useEffect(() => {
        fetchCryptos(1, 20).then(setCryptos);
    }, []);

    return <CryptoListClient initialCryptos={cryptos} />;
}
