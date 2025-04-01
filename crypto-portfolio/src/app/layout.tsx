"use client";

import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import ResponsiveAppBar from "@/components/Header/ResponsiveAppBar";
import React from "react";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-900 text-white">
        <div className="fixed top-0 left-0 right-0 z-50">
            <ResponsiveAppBar />
        </div>
        <div style={{ paddingTop: 'var(--app-bar-height)' }}>
            <Provider store={store}>
                {children}
            </Provider>
        </div>
        </body>
        </html>
    );
}