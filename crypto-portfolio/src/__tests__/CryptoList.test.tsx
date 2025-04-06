import React from 'react';
import {
    render,
    screen,
    fireEvent,
    within,
    waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CryptoListClient from '../app/crypto/components/CryptoListClient'; // Import the client component
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter } from 'next/navigation';

// Mock next/navigation for router functions
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Mock the API service
jest.mock('@/services/api', () => ({
    fetchCryptos: jest.fn().mockResolvedValue([]),
}));

// Mock Material UI components
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    CircularProgress: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock the star icons
jest.mock('@mui/icons-material/Star', () => () => (
    <svg data-testid="StarIcon">Star</svg>
));
jest.mock('@mui/icons-material/StarBorder', () => () => (
    <svg data-testid="StarBorderIcon">StarBorder</svg>
));

// Mock formatters
jest.mock('@/utils/formaters', () => ({
    formatLargeNumber: jest.fn((num) => `${num / 1000000000}B`),
    formatPriceChangePercent: jest.fn((num) =>
        num > 0 ? `+${num}%` : `${num}%`
    ),
}));

// Mock animations
jest.mock('@/utils/animations', () => ({
    linkUnderlineEffect: {},
}));

// Mock the intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock Redux store
const mockStore = configureStore([]);

describe('CryptoListClient Component', () => {
    const mockCryptos = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 50000,
            market_cap: 900000000000,
            price_change_percentage_24h: 5.2,
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            current_price: 3000,
            market_cap: 350000000000,
            price_change_percentage_24h: -2.1,
        },
        {
            id: 'ripple',
            name: 'XRP',
            symbol: 'xrp',
            current_price: 0.5,
            market_cap: 25000000000,
            price_change_percentage_24h: 1.3,
        },
    ];

    let store;
    let mockRouterPush;

    beforeEach(() => {
        store = mockStore({
            portfolio: {
                items: [
                    {
                        id: 'btc-1',
                        coin: { name: 'Bitcoin' },
                        selected: true,
                        type: 'watchlist',
                    },
                ],
            },
        });

        jest.clearAllMocks();

        // Set up router mock
        mockRouterPush = jest.fn();
        useRouter.mockImplementation(() => ({
            push: mockRouterPush,
        }));
    });

    test('renders crypto list with correct headers', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        // Check for table headers
        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Symbol')).toBeInTheDocument();
            expect(screen.getByText('Price')).toBeInTheDocument();
            expect(screen.getByText('Market Cap')).toBeInTheDocument();
            expect(screen.getByText('24h %')).toBeInTheDocument();
        });
    });

    test('displays the correct number of cryptocurrencies', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        // Check the correct count is displayed
        await waitFor(() => {
            expect(
                screen.getByText('Showing 3 out of 3 cryptocurrencies')
            ).toBeInTheDocument();
        });

        await waitFor(() => {
            const xrpElements = screen.getAllByText('XRP');
            expect(xrpElements.length).toBe(2); //looking for 2 xrp occurrences

            expect(screen.getByText('Bitcoin')).toBeInTheDocument();
            expect(screen.getByText('Ethereum')).toBeInTheDocument();
        });
    });

    test('filters cryptocurrencies based on search input', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'eth' } });

        // Wait for the UI to update after the search input
        await waitFor(() => {
            expect(screen.getByText('Ethereum')).toBeInTheDocument();
            expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
            expect(screen.queryByText('XRP')).not.toBeInTheDocument();

            expect(
                screen.getByText('Showing 1 out of 3 cryptocurrencies')
            ).toBeInTheDocument();
        });
    });

    test('sorts cryptocurrencies when column header is clicked', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        // Get all rows to check the current order
        const tableRows = screen.getAllByRole('row').slice(1); // Skip header row

        // Bitcoin should be first
        await waitFor(() => {
            expect(
                within(tableRows[0]).getByText('Bitcoin')
            ).toBeInTheDocument();
        });

        // sorts by, Price
        const priceHeader = screen.getByText('Price');
        fireEvent.click(priceHeader);

        // After sorting by price (asc), XRP should be first
        await waitFor(() => {
            const updatedTableRows = screen.getAllByRole('row').slice(1);
            const xrpElements = within(updatedTableRows[0]).getAllByText('XRP');
            expect(xrpElements.length).toBe(2);
        });

        // sorts by, desc
        fireEvent.click(priceHeader);

        // After sorting by price (desc), Bitcoin should be first
        await waitFor(() => {
            const finalTableRows = screen.getAllByRole('row').slice(1);
            expect(
                within(finalTableRows[0]).getByText('Bitcoin')
            ).toBeInTheDocument();
        });
    });

    test('displays star icon for watchlist items', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        const starIcons = screen.getAllByTestId('StarIcon');
        const starBorderIcons = screen.getAllByTestId('StarBorderIcon');

        await waitFor(() => {
            // Bitcoin should have a filled star (in watchlist)
            expect(starIcons.length).toBe(1);

            // Ethereum and XRP should have border stars (not in watchlist)
            expect(starBorderIcons.length).toBe(2);
        });
    });

    test('navigates to details page when a row is clicked', async () => {
        const router = useRouter();

        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        const bitcoinRow = screen.getByText('Bitcoin').closest('tr');
        fireEvent.click(bitcoinRow);
        await waitFor(() => {
            expect(router.push).toHaveBeenCalledWith('/crypto/bitcoin');
        });
    });

    test('shows loading indicator for infinite scrolling', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        await waitFor(() => {
            // Check if loading icon is displayed
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });
    });

    test('shows message when no cryptocurrencies match filters', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        await waitFor(() => {
            expect(
                screen.getByText('No cryptocurrencies match your filters')
            ).toBeInTheDocument();
        });
    });

    test('initializes IntersectionObserver for infinite scrolling', async () => {
        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        await waitFor(() => {
            // Check that IntersectionObserver was initialized
            expect(mockIntersectionObserver).toHaveBeenCalled();
        });
    });

    test('fetches more cryptos when intersection observer triggers', async () => {
        const { fetchCryptos } = require('@/services/api');
        fetchCryptos.mockResolvedValueOnce([
            {
                id: 'dogecoin',
                name: 'Dogecoin',
                symbol: 'doge',
                current_price: 0.1,
                market_cap: 10000000000,
                price_change_percentage_24h: 10.5,
            },
        ]);

        render(
            <Provider store={store}>
                <CryptoListClient initialCryptos={mockCryptos} />
            </Provider>
        );

        // Simulate intersection observer callback
        const [observerCallback] = mockIntersectionObserver.mock.calls[0];
        observerCallback([{ isIntersecting: true }]);

        await waitFor(() => {
            // Check that fetchCryptos was called with the next page
            expect(fetchCryptos).toHaveBeenCalledWith(2, 20);
        });
    });
});
