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
      default: "#fff",
      paper: "#ecebea",
    },
  },
});

export default theme;
