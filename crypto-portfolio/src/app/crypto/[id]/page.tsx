// app/crypto/[id]/page.tsx
import React from 'react';
import CryptoDetail from '@/components/Details/CryptoDetail';

interface Props {
    params: {
        id: string;
    };
}

const CryptoDetailPage = async ({ params }: Props) => {
    const { id } = params;

    return <CryptoDetail cryptoId={id} />;
};

export default CryptoDetailPage;
