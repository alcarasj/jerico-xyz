import React from "react";
import { HomePage } from "./pages/HomePage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { Footer } from "./components/Footer";
import orange from "@material-ui/core/colors/orange";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { Settings } from './utils/Settings';
import { CustomAppBar } from "./components/CustomAppBar";
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

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
			width: '100vw'
		},
		me: {
			height: theme.spacing(30),
			width: theme.spacing(30)
		},
		body: {
			paddingTop: theme.spacing(15),
			paddingBottom: theme.spacing(20),
		},
		paper: {
			backgroundImage: "url(" + Settings.STATIC_DIR + "img/bg.jpg)"
		}
	}),
);

export interface AppProps {}

export const App = (props: AppProps) =>  {
	const classes = useStyles({});

	return (
		<MuiThemeProvider theme={theme}>		
			<CssBaseline />

			<div className={classes.root}>
				<Paper className={classes.paper}>
					<Router>
						<CustomAppBar />
						<Switch>
							<Route path="/">
								<HomePage />
							</Route>
						</Switch>
						<Footer />
					</Router>
				</Paper>
			</div>
		</MuiThemeProvider>
	);

};