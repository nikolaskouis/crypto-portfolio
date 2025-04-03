import React from "react";
import { Card, Grid, Typography, TextField, Button, Box, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

const Footer = () => {
    return (
        <Card sx={{ backgroundColor: (theme) => theme.palette.background.default,
            color:(theme) => theme.palette.text.primary, p: 4 }}>
            <Grid container spacing={3} display="flex" justifyContent="space-around">

                {/* Support Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Support</Typography>
                    <Box>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Request Form</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Contact Support</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>FAQ</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Security</Link>
                    </Box>
                </Grid>

                {/* Company Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Company</Typography>
                    <Box>
                        <Link href="#" sx={{ display: "block", color: (theme) => theme.palette.text.primary, textDecoration: "none" }}>About Us</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Careers</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>News</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Security</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Community</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Announcements</Link>
                    </Box>
                </Grid>

                {/* Crypto Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Crypto</Typography>
                    <Box>
                        <Link href="#" sx={{ display: "block", color: (theme) => theme.palette.text.primary, textDecoration: "none" }}>Bitcoin</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Ethereum</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Tether</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Solana</Link>
                        <Link href="#" sx={{ display: "block", color:(theme) => theme.palette.text.primary, textDecoration: "none" }}>Dogecoin</Link>
                    </Box>
                </Grid>
            </Grid>

            {/* Social Icons */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 3 }}>
                <Facebook sx={{ color:(theme) => theme.palette.text.primary, cursor: "pointer" }} />
                <Instagram sx={{ color:(theme) => theme.palette.text.primary, cursor: "pointer" }} />
                <Twitter sx={{ color:(theme) => theme.palette.text.primary, cursor: "pointer" }} />
                <LinkedIn sx={{ color:(theme) => theme.palette.text.primary, cursor: "pointer" }} />
            </Box>

        </Card>
    );
};

export default Footer;
