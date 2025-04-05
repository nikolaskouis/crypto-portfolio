"use client";
import { useSelector } from "react-redux";
import { selectWatchlistItems } from "@/redux/portfolioSelectors";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function WatchlistStar({ cryptoName }: { cryptoName: string }) {
    const watchListItems = useSelector(selectWatchlistItems);
    const isInWatchlist = watchListItems.some(
        (item: WatchlistItem) => item.coin.name === cryptoName && item.selected
    );

    return isInWatchlist ? <StarIcon /> : <StarBorderIcon />;
}
