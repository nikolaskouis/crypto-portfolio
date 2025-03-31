import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useState } from "react";

const CryptoList = ({ cryptos }: { cryptos: Crypto[] }) => {
    const [search, setSearch] = useState("");

    return (
        <Container>
            <h1>Cryptocurrency List</h1>
            <TextField
                fullWidth
                label="Search Cryptocurrency"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cryptos
                        .filter((crypto) => crypto.name.toLowerCase().includes(search))
                        .map((crypto) => (
                            <TableRow
                                key={crypto.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{crypto.name}</TableCell>
                                <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                                <TableCell>${crypto.current_price}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default CryptoList;
