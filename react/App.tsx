import React, { useState, useEffect, useRef } from "react";
import { HomePage } from "./pages/HomePage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { Footer } from "./components/Footer";
import orange from "@material-ui/core/colors/orange";
import Grid from "@material-ui/core/Grid";
import Grow from '@material-ui/core/Grow';
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
declare const VANTA: any;


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
		},
		embedPlayer: {
			marginTop: theme.spacing(10),
			marginBottom: theme.spacing(10)
		},
	}),
);

export interface AppProps {}

export const App = (props: AppProps) =>  {
	const classes = useStyles({});
	const [vantaEffect, setVantaEffect] = useState(0);
	const myRef = useRef(null);
	useEffect(() => {
		if (!vantaEffect) {
		  setVantaEffect(VANTA.BIRDS({
			el: myRef.current,
			backgroundColor: 0x424242,
			backgroundAlpha: 0.00,
			color1: 0xf44336,
			color2: 0xff9800,
			colorMode: "lerpGradient"
		  }))
		}
	}, [vantaEffect]);

	return (
		<MuiThemeProvider theme={theme}>		
			<CssBaseline />

			<div className={classes.root}>
				<Paper ref={myRef} className={classes.paper}>
					<Router>
						<CustomAppBar />
						<Switch>
							<Route path="/">
								<HomePage />
							</Route>
						</Switch>
						<Grid container alignItems='center' justify='center'>
							<Grow in timeout={1500}>
								<iframe className={classes.embedPlayer} width="30%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/545610837&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
							</Grow>
						</Grid>
						<Footer />
					</Router>
				</Paper>
			</div>
		</MuiThemeProvider>
	);

};