"use client";
import CryptoList from "@/components/Lists/CryptoList";
import { fetchCryptos } from "@/services/api";
import { useEffect, useState } from "react";

export default function Home() {
    const [cryptos, setCryptos] = useState<Crypto[]>([]);

    useEffect(() => {
        const getCryptos = async () => {
            try {
                const data = await fetchCryptos();
                console.log(data);
                setCryptos(data);
            } catch (error) {
                console.error("Error fetching cryptos:", error);
            }
        };

        getCryptos();
    }, []);

    console.log(cryptos);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold">Crypto Portfolio</h1>
            <p className="text-lg text-gray-400 mt-2">
                Track and manage your favorite cryptocurrencies.
            </p>

            <div className="w-full max-w-4xl mt-8 px-4 pt-8">
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <CryptoList cryptos={cryptos}/>
                </div>
            </div>
        </main>
    );
}
