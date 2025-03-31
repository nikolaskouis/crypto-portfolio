import "./globals.css";

export const metadata = {
    title: "Crypto Portfolio",
    description: "Track your favorite cryptocurrencies",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-900 text-white">{children}</body>
        </html>
    );
}
