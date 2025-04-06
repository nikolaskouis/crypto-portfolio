// app/crypto/[id]/page.tsx
import CryptoDetail from '@/components/Details/CryptoDetail';

export default async  function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <CryptoDetail cryptoId={id} />;
};