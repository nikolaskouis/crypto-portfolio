"use client"
import React, { useState, useEffect, Suspense } from "react";
import { Alert } from "@mui/material";
import { fetchCryptos } from "@/services/api";
import CryptoList from "@/components/Lists/CryptoList";
import ResponsiveAppBar from "@/components/Header/ResponsiveAppBar";

export default function Home() {
    const max_size = 20;
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1); // Track current page

    useEffect(() => {
        const getCryptos = async () => {
            setLoading(true);
            setError(null);
            console.log("getCryptos" + page);
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

    return (
        <main className="flex flex-col items-center justify-center text-white" >
            <div className="w-full max-w-4xl px-4">
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                        <CryptoList
                            cryptos={cryptos}
                            setPage={setPage}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}