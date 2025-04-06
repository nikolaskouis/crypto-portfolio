import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CryptoDetail from '../components/Details/CryptoDetail';
import * as api from '@/services/api';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

//TODO: FIX TESTS

// Mock the Redux store
const mockStore = configureStore([]);

// Mock the dynamic import for financial chart
jest.mock('next/dynamic', () => () => {
    return () => (
        <div data-testid="mocked-chart">Chart Mock</div>
    );
});

// Mock the API calls
jest.mock('@/services/api', () => ({
    getCrypto: jest.fn(),
    fetchGraph: jest.fn(),
}));

// Mock Redux dispatch
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

describe('CryptoDetail Component', () => {
    const mockCryptoData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        image: {
            small: '/bitcoin-logo.png',
        },
        market_data: {
            current_price: { usd: 50000 },
            price_change_percentage_24h: 5.25,
            market_cap: { btc: 1000000000 },
            market_cap_change_percentage_24h: 2.5,
            total_volume: { btc: 50000000 },
            total_supply: 21000000,
            max_supply: 21000000,
            circulating_supply: 19000000,
        },
        tickers: [{ last: 50000 }],
    };

    const mockChartData = [
        [1617753600000, 50000, 52000, 49000, 51000],
        [1617840000000, 51000, 53000, 50000, 52000],
    ];

    let store;

    beforeEach(() => {
        store = mockStore({
            portfolio: {
                watchlist: [],
                portfolio: [],
            },
        });

        // Reset mocks
        jest.clearAllMocks();

        // Setup API mock returns
        (api.getCrypto as jest.Mock).mockResolvedValue(mockCryptoData);
        (api.fetchGraph as jest.Mock).mockResolvedValue(mockChartData);
    });

    test('renders loading skeleton initially', () => {
        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        expect(
            screen.getByTestId('crypto-detail-skeleton')
        ).toBeInTheDocument();
    });

    test('renders crypto details after loading', async () => {
        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId('crypto-detail-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(await screen.findByText(/Bitcoin/i)).toBeInTheDocument();
        expect(await screen.findByText(/Buy btc/i)).toBeInTheDocument();
        expect(await screen.findByText(/USD/i)).toBeInTheDocument();
    });

    test('changes timeframe when user clicks on a timeframe chip', async () => {
        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId('crypto-detail-skeleton')
            ).not.toBeInTheDocument();
        });

        const sevenDaysChip = screen.getByText('7 Days');
        fireEvent.click(sevenDaysChip);

        // Verify the API was called with the new timeframe
        await waitFor(() => {
            expect(api.fetchGraph).toHaveBeenCalledWith('bitcoin', '7');
        });
    });

    test('adds crypto to watchlist when watchlist button is clicked', async () => {
        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId('crypto-detail-skeleton')
            ).not.toBeInTheDocument();
        });

        // Find and click the watchlist button
        const watchlistButton = screen.getByRole('button', {
            name: /watchlist/i,
        });
        fireEvent.click(watchlistButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Added to watchlist!/i)
            ).toBeInTheDocument();
        });
    });

    test('adds crypto to portfolio when buy button is clicked', async () => {
        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId('crypto-detail-skeleton')
            ).not.toBeInTheDocument();
        });

        // Find and click the buy button
        const buyButton = await screen.findByTestId('buy-button');
        fireEvent.click(buyButton);

        // Check if the snackbar appears with correct message
        await waitFor(() => {
            expect(
                screen.getByText(/Added to portfolio!/i)
            ).toBeInTheDocument();
        });
    });

    test('handles API error gracefully', async () => {
        // Override the mock to simulate an error
        (api.getCrypto as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(
            <Provider store={store}>
                <CryptoDetail cryptoId="bitcoin" />
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to fetch cryptocurrency Details/i)
            ).toBeInTheDocument();
        });
    });
});
