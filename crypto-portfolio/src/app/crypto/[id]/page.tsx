// app/crypto/[id]/page.tsx
import CryptoDetail from '@/components/Details/CryptoDetail';

interface Props {
    params: {
        id: string;
    };
}

const CryptoDetailPage = ({ params }: Props) => {
    const { id } = params;

    return <CryptoDetail cryptoId={id} />;
};

export default CryptoDetailPage;
