import {
    Box,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Typography,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import React, {useRef, useState} from "react";

interface IFilterSearchBarProps {
    cryptos: Crypto[];
    search: string;
    setSearch: (search: string) => void;
    marketCapFilter: string;
    setMarketCapFilter: (marketCapFilter: string) => void;
    priceRange: [number, number];
    setPriceRange: (priceRange: [number, number]) => void;
    performanceFilter: string;
    setPerformanceFilter: (performanceFilter: string) => void;
    sortConfig: { key: keyof Crypto; direction: "asc" | "desc" } | null;
    setSortConfig: (sortConfig: { key: keyof Crypto; direction: "asc" | "desc" } | null) => void;
}

const FilterSearchBar : React.FC<IFilterSearchBarProps> = ({cryptos, sortConfig, setSortConfig, search, performanceFilter, setPerformanceFilter, setMarketCapFilter, marketCapFilter, setSearch, setPriceRange, priceRange}) => {
    const theme = useTheme();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const maxPrice = Math.max(...cryptos.map((crypto :Crypto) => crypto.current_price));

    const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as [number, number]);
    };

    const clearFilters = () => {
        setSearch("");
        setMarketCapFilter("all");
        setPriceRange([0, maxPrice]);
        setPerformanceFilter("all");
        setSortConfig(null);
    };

    return (
        <>
            {/* Pills + Search */}
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                mb={3}
                gap={2}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Coin List
                    </Typography>
                    <Typography variant="body2">
                        Lorem Ipsum is simply dummy text of the printing.
                    </Typography>
                </Box>

                {/* Search + Filter Icon */}
                <Paper
                    component="form"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: { xs: "100%", sm: 250 },
                        borderRadius: 2,
                        px: 1,
                    }}
                >
                    <SearchIcon />
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                        <TuneIcon />
                    </IconButton>
                </Paper>
            </Box>

            {/* Advanced Filters */}
            {showAdvanced && (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid>
                            <FormControl fullWidth>
                                <InputLabel>Market Cap</InputLabel>
                                <Select
                                    value={marketCapFilter}
                                    label="Market Cap"
                                    onChange={(e) => setMarketCapFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Market Caps</MenuItem>
                                    <MenuItem value="small">Small Cap (&lt; $10B)</MenuItem>
                                    <MenuItem value="medium">Mid Cap ($10B - $50B)</MenuItem>
                                    <MenuItem value="large">Large Cap (&gt; $50B)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <FormControl fullWidth>
                                <InputLabel>24h Performance</InputLabel>
                                <Select
                                    value={performanceFilter}
                                    label="24h Performance"
                                    onChange={(e) => setPerformanceFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Performance</MenuItem>
                                    <MenuItem value="positive">Positive (+)</MenuItem>
                                    <MenuItem value="negative">Negative (-)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mb: 3, ml: 1.5 }}>
                        <Grid sx={{ width: "100%" }}>
                            <Box >
                                <Typography>Price Range</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={maxPrice}
                                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid>
                            <Chip
                                label="Clear All Filters"
                                onClick={clearFilters}
                                variant="outlined"
                                color="primary"
                                sx={{ ml: "auto" }}
                            />
                        </Grid>
                    </Grid>
                    </>
            )}

            {/* Active Filters */}
            {(search ||
                marketCapFilter !== "all" ||
                performanceFilter !== "all" ||
                priceRange[0] > 0 ||
                priceRange[1] < maxPrice) && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Active Filters:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {search && (
                            <Chip
                                size="small"
                                label={`Search: ${search}`}
                                onDelete={() => setSearch("")}
                            />
                        )}
                        {marketCapFilter !== "all" && (
                            <Chip
                                size="small"
                                label={`Market Cap: ${marketCapFilter}`}
                                onDelete={() => setMarketCapFilter("all")}
                            />
                        )}
                        {performanceFilter !== "all" && (
                            <Chip
                                size="small"
                                label={`Performance: ${performanceFilter}`}
                                onDelete={() => setPerformanceFilter("all")}
                            />
                        )}
                        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                            <Chip
                                size="small"
                                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                                onDelete={() => setPriceRange([0, maxPrice])}
                            />
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default FilterSearchBar;
