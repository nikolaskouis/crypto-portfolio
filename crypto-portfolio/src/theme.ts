import { createTheme} from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#8AC8FF",
        },
        secondary: {
            main: "#B7DCFF",
        },
        background: {
            default: "#0D1117",
            paper: "#0a0c10",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#C9D1D9",
        },
    },

    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: { fontWeight: 700, fontSize: "2rem" },
        h2: { fontWeight: 600, fontSize: "1.5rem" },
        body1: { fontSize: "1rem" },
        body2: { fontSize: "0.875rem" },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: "#06060c",
                    color: "#FFFFFF",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.5)",
                },
            },
        },
    }

});

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#8AC8FF",
        },
        secondary: {
            main: "#E2F2FF",
        },
        background: {
            default: "#FFFFFF",
            paper: "#FDFEFF",
        },
        text: {
            primary: "#000000",
            secondary: "#333333",
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: { fontWeight: 700, fontSize: "2rem" },
        h2: { fontWeight: 600, fontSize: "1.5rem" },
        body1: { fontSize: "1rem" },
        body2: { fontSize: "0.875rem" },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: "#f5f5f6",
                    color: "#221f1f",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.5)",
                },
            },
        },
    }
});

export { darkTheme, lightTheme };
