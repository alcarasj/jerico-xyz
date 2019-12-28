import React, { useState, useEffect, useRef } from "react";
import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Settings } from "../utils/Settings";
import {
	Link
} from "react-router-dom";
declare const VANTA: any;

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
			paddingBottom: theme.spacing(20)
		},
		paper: {
			backgroundImage: "url(" + Settings.STATIC_DIR + "img/bg.jpg)"
		},
		card: {
			height: '100%'
		},
		embedPlayer: {
			marginTop: theme.spacing(10)
		},
		cardContainer: {
			maxWidth: 300
		}
	}),
);

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

	const renderHomeCards = () => {
		let cards = [];
		for (var i = 0; i < Settings.HOME_CARDS.length; i++) {
			const data = Settings.HOME_CARDS[i];
			cards.push(
				<Grid item xs={12} className={classes.cardContainer}>
						<Card className={classes.card}>
							<CardActionArea>
								<CardContent>
								  <Typography gutterBottom variant="h5" component="h2">
								  { data.title }
								  </Typography>
								  <Typography variant="body2" color="textSecondary" component="p">
								  { data.description }
								  </Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="primary">
									Coming soon™
									</Button>
								</CardActions>
							</CardActionArea>
						</Card>
				</Grid>
			);
		}
		return (
			<Grid container spacing={1} alignItems='flex-start' justify='center'>
			{ cards }
			</Grid>
		);
	};

	return (
		<Grid ref={myRef} container justify="center" alignItems="center" direction="column">
			<Grid item xs>
				<Grid className={classes.body} container justify="center" alignItems="center" direction="column" spacing={3}>
					<Grid item xs>
						<Grow in timeout={750}>
							<Avatar className={classes.me} alt="Jerico Alcaras" src={Settings.STATIC_DIR + "img/jerico-2019-460x460.jpg"}/>
						</Grow>
					</Grid>
					<Grid item xs>
						<Grow in timeout={1000}>
							<Typography align="center" variant="h3" component="h1">Hi! My name is Jerico.</Typography>
						</Grow>
						<Grow in timeout={1200}>
							<Typography align="center" variant="subtitle1" gutterBottom>Thanks for visiting! Select an area of interest below to learn more about me.</Typography>
						</Grow>
					</Grid>
					<Grid item xs>
						{ renderHomeCards() }
					</Grid>
					<Grid item xs>
						<iframe className={classes.embedPlayer} width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/545610837&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};