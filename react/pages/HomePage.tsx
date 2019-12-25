import React from "react";
import { CustomAppBar } from "../components/CustomAppBar";
import Avatar from '@material-ui/core/Avatar';
import { Footer } from "../components/Footer";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
	Link
} from "react-router-dom";

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

	return (
		<div className={classes.root}>
			<CustomAppBar />
			<Paper>
				<Grid container justify="center" alignItems="center" direction="column">
					<Grid item xs>
						<Grid className={classes.body} container justify="center" alignItems="center" spacing={5}  direction="column">
							<Grid item xs>
								<Avatar className={classes.me} alt="Jerico Alcaras" src={STATIC_DIR + "img/jerico-2019-460x460.jpg"}/>
							</Grid>
							<Grid item xs>
								<Typography align="center" variant="h3" component="h3">Hi! My name is Jerico.</Typography>
								<Typography align="center" variant="subtitle1">This is my personal website - it's currently under construction. Maybe check back again soon? :)</Typography>
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