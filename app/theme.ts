import { createTheme, type Theme } from "@mui/material";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#c71a4b",
    },
    secondary: {
      main: "#ebcd0a",
    },
    background: {
      default: "#ecebea",
      paper: "#fff",
    },
    error: {
      main: "#d32f2f",
    },
    success: {
      main: "#43a047",
    },
    info: {
      main: "#1976d2",
    },
    warning: {
      main: "#f57c00",
    },
  },
});

export default theme;
