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
            paper: "#161B22",
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
});

export { darkTheme, lightTheme };
