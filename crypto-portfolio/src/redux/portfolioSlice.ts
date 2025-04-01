// redux/portfolioSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioState {
    items: any[];
}

const initialState: PortfolioState = {
    items: [],
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addToPortfolio: (state, action: PayloadAction<any>) => {
            state.items.push(action.payload);
        },
    },
});

export const { addToPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;