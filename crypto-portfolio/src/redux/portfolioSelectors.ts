import { createSelector } from '@reduxjs/toolkit';

const selectPortfolioState = (state: any) => state.portfolio.items;

export const selectPortfolioItems = createSelector(
    [selectPortfolioState],
    (items = []) => items.filter((item: PortfolioItem) => item.type === 'portfolio')
);

export const selectWatchlistItems = createSelector(
    [selectPortfolioState],
    (items = []) => items.filter((item: WatchlistItem) => item.type === 'watchlist')
);
