import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark", // This sets the theme to dark mode
    primary: {
      main: "#FF5722", // Customize the primary color to your preference
    },
    secondary: {
      main: "#FFC107", // Customize the secondary color to your preference
    },
    black: {
      main: "#242B2E",
    },
    background: {
      main: "#000000",
      default: "#121212",
      paper: "#1E1E1E",
    },
    textColor: {
      main: "#111111",
    },
  },
});

export default darkTheme;
