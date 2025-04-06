'use effect';
import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import Logo from '@/components/Logo';
import ThemeToggleButton from '../Buttons/ThemeToggleButton';
import { selectPortfolioItems } from '@/redux/portfolioSelectors';
import { useRouter } from 'next/navigation';
import { circleLineEffect, linkUnderlineEffect } from '@/utils/animations';
import { formatNumberWithCommas } from '@/utils/formaters';

const pages = ['Lists', 'Wallet'];
const settings = ['Profile', 'Account', 'Settings', 'Logout'];

//MUI Responsive Bar
function ResponsiveAppBar() {
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const portfolioItems = useSelector(selectPortfolioItems);

    const totalPortfolioValue = portfolioItems.reduce(
        (total: number, item: PortfolioItem) => total + item.price,
        0
    );

    const handleNavClick = (page: string) => {
        if (page === 'Lists') router.push('/');
        else if (page === 'Wallet') router.push('/wallet');
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="a" href="/">
                        <Logo />
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClick={() => {
                                handleCloseNavMenu();
                            }}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={() => {
                                        handleNavClick(page);
                                        handleCloseNavMenu();
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    handleNavClick(page);
                                    handleCloseNavMenu();
                                }}
                                sx={linkUnderlineEffect}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <ThemeToggleButton />
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Wallet">
                            <Box
                                sx={linkUnderlineEffect}
                                onClick={() => router.push('/wallet')}
                            >
                                <Typography>
                                    <AccountBalanceWalletIcon /> ${' '}
                                    {formatNumberWithCommas(
                                        totalPortfolioValue
                                    )}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <Box sx={circleLineEffect}>
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="/static/images/avatar/2.jpg"
                                    />
                                </IconButton>
                            </Box>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={handleCloseUserMenu}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
