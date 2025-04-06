'use client';

import './globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store'
import ResponsiveAppBar from '@/components/Header/ResponsiveAppBar';
import React from 'react';
import { ThemeToggleProvider } from '@/context/ThemeContext';
import Footer from '../components/Footer/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeToggleProvider>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <div className="flex flex-col min-h-screen">
                                <header className="z-50">
                                    <ResponsiveAppBar />
                                </header>

                                <main className="flex-1 overflow-y-auto">
                                    {children}
                                </main>

                                <footer className="z-50">
                                    <Footer />
                                </footer>
                            </div>
                        </PersistGate>
                    </Provider>
                </ThemeToggleProvider>
            </body>
        </html>
    );
}
