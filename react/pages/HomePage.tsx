import React, { useState, useEffect, useRef } from "react";
import { CustomAppBar } from "../components/CustomAppBar";
import Avatar from '@material-ui/core/Avatar';
import { Footer } from "../components/Footer";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import { Data } from "../utils/Data";
import {
	Link
} from "react-router-dom";
declare const VANTA: any;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		me: {
			height: theme.spacing(30),
			width: theme.spacing(30)
		},
		body: {
			paddingTop: theme.spacing(15),
			paddingBottom: theme.spacing(20),
		}
	}),
);

const STATIC_DIR = "../../../static/";

export interface HomePageProps {}

export const HomePage = (props: HomePageProps) => {
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
		<div className={classes.root}>
			<CustomAppBar />
			<Paper>
				<Grid ref={myRef} container justify="center" alignItems="center" direction="column">
					<Grid item xs>
						<Grid className={classes.body} container justify="center" alignItems="center" spacing={5}  direction="column">
							<Grid item xs>
								<Grow in timeout={750}>
									<Avatar className={classes.me} alt="Jerico Alcaras" src={STATIC_DIR + "img/jerico-2019-460x460.jpg"}/>
								</Grow>
							</Grid>
							<Grid item xs>
								<Grow in timeout={1000}>
									<Typography align="center" variant="h3" component="h1">Hi! My name is Jerico.</Typography>
								</Grow>
								<Grow in timeout={1200}>
									<Typography align="center" variant="subtitle1" gutterBottom>SOFTWARE ENGINEER • GRAPHIC DESIGNER • MUSICIAN</Typography>
								</Grow>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs>
						<Footer />
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};