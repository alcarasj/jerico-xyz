import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
  ,
  document.getElementById("app")
);