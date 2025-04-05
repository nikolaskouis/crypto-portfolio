import React from "react";
import { Card, Grid, Typography, TextField, Button, Box, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import {useTheme} from "@mui/system";
import {circleLineEffect, footerUnderlineEffect, linkUnderlineEffect} from "@/utils/animations";

const Footer = () => {
    const theme = useTheme();
    const color = theme.palette.secondary.main;
    return (
        <Card sx={{ backgroundColor: (theme) => theme.palette.primary.main,
            color:color, p: 4 }}>
            <Grid container spacing={3} display="flex" justifyContent="space-around">

                {/* Support Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Support</Typography>
                    <Box>
                        <Link href="#" sx={footerUnderlineEffect}>Request Form</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Contact Support</Link>
                        <Link href="#" sx={footerUnderlineEffect}>FAQ</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Security</Link>
                    </Box>
                </Grid>

                {/* Company Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Company</Typography>
                    <Box>
                        <Link href="#" sx={footerUnderlineEffect}>About Us</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Careers</Link>
                        <Link href="#" sx={footerUnderlineEffect}>News</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Security</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Community</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Announcements</Link>
                    </Box>
                </Grid>

                {/* Crypto Section */}
                <Grid>
                    <Typography variant="h5" sx={{pb:"10px"}}>Crypto</Typography>
                    <Box>
                        <Link href="#" sx={footerUnderlineEffect}>Bitcoin</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Ethereum</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Tether</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Solana</Link>
                        <Link href="#" sx={footerUnderlineEffect}>Dogecoin</Link>
                    </Box>
                </Grid>
            </Grid>

            {/* Social Icons */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 3 }}>
                <Facebook sx={circleLineEffect} />
                <Instagram sx={circleLineEffect} />
                <Twitter sx={circleLineEffect} />
                <LinkedIn sx={circleLineEffect} />
            </Box>
        </Card>
    );
};

export default Footer;
