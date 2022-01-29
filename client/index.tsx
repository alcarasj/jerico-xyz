import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { SnackbarProvider } from 'notistack';
import { blue, indigo } from "@mui/material/colors";
import { adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

const theme = createTheme(adaptV4Theme({
  palette: {
    mode: "dark",
    primary: blue,
    secondary: indigo
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
}));

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>    
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </SnackbarProvider>
  ,
  document.getElementById("app")
);