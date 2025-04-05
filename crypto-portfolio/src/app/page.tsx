"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Alert, Box, Container, Paper } from "@mui/material";
import { fetchCryptos } from "@/services/api";
import CryptoList from "@/components/Lists/CryptoList";
import MarketCoins from "@/components/Shortcuts/MarketCoins";

export default function Home() {
    const router = useRouter();
    const max_size = 20;
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getCryptos = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchCryptos(page, max_size);
                setCryptos((prevCryptos) => [...prevCryptos, ...data]);
            } catch (err) {
                setError("Failed to fetch cryptocurrencies.");
                console.error("Error fetching cryptos:", err);
            } finally {
                setLoading(false);
            }
        };

        getCryptos();
    }, [page]);

    const navigateToDetails = (id: string) => {
        router.push(`/crypto/${id}`);
    };

    return (
        <Box
            component="main"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="background.default"
            px={2}
            sx={{paddingBottom: "2rem"}}
        >
            <Container maxWidth="md" >
                {error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <>
                        <MarketCoins/>
                        <CryptoList
                            cryptos={cryptos}
                            setPage={setPage}
                            loading={loading}
                            setLoading={setLoading}
                            onRowClick={navigateToDetails}
                        />
                    </>
                )}
            </Container>
        </Box>
    );
}
