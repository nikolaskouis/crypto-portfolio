// redux/portfolioSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Item = PortfolioItem | WatchlistItem;

interface PortfolioState {
    items: Item[];
}

const initialState: PortfolioState = {
    items: [],
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addToPortfolio: (state, action: PayloadAction<Omit<PortfolioItem, 'type'>>) => {
            const exists = state.items.some(item => item.id === action.payload.id && item.type === 'portfolio');
            if (!exists) {
                state.items.push({ ...action.payload, type: 'portfolio' });
            }
        },
        addToWatchlist: (state, action: PayloadAction<Omit<WatchlistItem, 'type'>>) => {
            const exists = state.items.some(item => item.id === action.payload.id && item.type === 'watchlist');
            if (!exists) {
                state.items.push({ ...action.payload, type: 'watchlist' });
            }
        }
    },
});


export const { addToPortfolio, addToWatchlist } = portfolioSlice.actions;
export default portfolioSlice.reducer;