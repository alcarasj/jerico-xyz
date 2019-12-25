import React from "react";
import { HomePage } from "./pages/HomePage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: red,
		secondary: orange
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
});

export interface AppProps { compiler: string; framework: string; }

export const App = (props: AppProps) =>  {

	return (
		<MuiThemeProvider theme={theme}>		
			<CssBaseline />
			<Router>
				<Switch>
					<Route path="/">
						<HomePage />
					</Route>
				</Switch>
			</Router>
		</MuiThemeProvider>
	);

};