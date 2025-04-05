import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CryptoList from '../app/crypto/page';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock Material UI components that might cause issues in tests
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    CircularProgress: () => <div data-testid="loading-spinner">Loading...</div>
}));

// Mock the intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock Redux store
const mockStore = configureStore([]);

describe('CryptoList Component', () => {
    const mockCryptos = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 50000,
            market_cap: 900000000000,
            price_change_percentage_24h: 5.2
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            current_price: 3000,
            market_cap: 350000000000,
            price_change_percentage_24h: -2.1
        },
        {
            id: 'ripple',
            name: 'XRP',
            symbol: 'xrp',
            current_price: 0.5,
            market_cap: 25000000000,
            price_change_percentage_24h: 1.3
        }
    ];

    const mockSetPage = jest.fn();
    const mockSetLoading = jest.fn();
    const mockOnRowClick = jest.fn();

    let store;

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

        Element.prototype.scrollTo = jest.fn();
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 1000 });
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 400 });
    });


    test('renders crypto list with correct headers', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        // Check for table headers
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Symbol')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Market Cap')).toBeInTheDocument();
        expect(screen.getByText('24h %')).toBeInTheDocument();
    });

    test('displays the correct number of cryptocurrencies', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        // Check the correct count is displayed
        expect(screen.getByText('Showing 3 out of 3 cryptocurrencies')).toBeInTheDocument();

        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getAllByText('XRP').length).toBeGreaterThan(0);
    });

    test('filters cryptocurrencies based on search input', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'eth' } });

        // Check that only Ethereum is shown
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
        expect(screen.queryByText('XRP')).not.toBeInTheDocument();

        // Check the count is updated
        expect(screen.getByText('Showing 1 out of 3 cryptocurrencies')).toBeInTheDocument();
    });

    test('sorts cryptocurrencies when column header is clicked', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        // Get all rows to check the current order
        const tableRows = screen.getAllByRole('row').slice(1); // Skip header row

        // Bitcoin should be first
        expect(within(tableRows[0]).getByText('Bitcoin')).toBeInTheDocument();

        // sorts by, Price
        const priceHeader = screen.getByText('Price');
        fireEvent.click(priceHeader);

        // After sorting by price (asc), XRP should be first
        const updatedTableRows = screen.getAllByRole('row').slice(1);
        expect(within(updatedTableRows[0]).getAllByText('XRP').length).toBeGreaterThan(0);

        // sorts by, desc
        fireEvent.click(priceHeader);

        // After sorting by price (desc), Bitcoin should be first
        const finalTableRows = screen.getAllByRole('row').slice(1);
        expect(within(finalTableRows[0]).getByText('Bitcoin')).toBeInTheDocument();
    });

    //this might not work at the moment
    test('displays star icon for watchlist items', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        const starIcons = document.querySelectorAll('svg[data-testid="StarIcon"]');
        const starBorderIcons = document.querySelectorAll('svg[data-testid="StarBorderIcon"]');

        // Bitcoin should have a filled star (in watchlist)
        expect(starIcons.length).toBe(1);

        // Ethereum and XRP should have border stars (not in watchlist)
        expect(starBorderIcons.length).toBe(2);
    });

    test('calls onRowClick with correct id when a row is clicked', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        const bitcoinRow = screen.getByText('Bitcoin').closest('tr');
        fireEvent.click(bitcoinRow);

        expect(mockOnRowClick).toHaveBeenCalledWith('bitcoin');
    });

    test('shows loading indicator when loading prop is true', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={true}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        // Check if loading icon is displayed
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        expect(screen.getByText('Loading more...')).toBeInTheDocument();
    });

    test('shows message when no cryptocurrencies match filters', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        expect(screen.getByText('No cryptocurrencies match your filters')).toBeInTheDocument();
    });

    // This test mocks the scroll event to ensure infinite scrolling triggers correctly
    test('triggers loading more data when scrolled to bottom', () => {
        render(
            <Provider store={store}>
                <CryptoList
                    cryptos={mockCryptos}
                    setPage={mockSetPage}
                    loading={false}
                    setLoading={mockSetLoading}
                    onRowClick={mockOnRowClick}
                />
            </Provider>
        );

        // Get the scrollable container
        const scrollContainer = document.querySelector('[aria-label="cryptocurrency table"]')
            .closest('div[class*="Paper"]');

        // Mock scrolling to bottom
        Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 600 });
        fireEvent.scroll(scrollContainer);

        // Check if setLoading and setPage were called
        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetPage).toHaveBeenCalled();
    });
});