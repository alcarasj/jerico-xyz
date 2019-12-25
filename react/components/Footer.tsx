import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GithubCircle, Linkedin } from 'mdi-material-ui';
import IconButton from '@material-ui/core/IconButton';



const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
			backgroundColor: theme.palette.primary.main,
			width: "100vw",
			bottom: 0,
			padding: theme.spacing(10)
		},
		link: {
			color: "inherit"
		}
	}),
);

interface FooterProps {};

export const Footer = (props: FooterProps) => {
	const classes = useStyles({});

	return (
		<Paper className={classes.root}>
			<Grid container alignItems="center" justify="space-between" spacing={3}>
				<Grid item xs>
					<Typography align="left" variant="body1" gutterBottom>
						© JERICO ALCARAS 2020. All rights reserved.
					</Typography>
					<Typography align="left" variant="body1" gutterBottom>
						DISCLAIMER: Use this site at your own risk!
					</Typography>
				</Grid>
				<Grid item xs>
					<Grid container alignItems="center" justify="center">
						<a href="https://www.linkedin.com/in/jcalcaras/" target="_blank">
							<IconButton aria-label="linkedin">
								<Linkedin />
							</IconButton>
						</a>
						<a href="https://github.com/alcarasj" target="_blank">
							<IconButton aria-label="github">
								<GithubCircle />
							</IconButton>
						</a>
					</Grid>
				</Grid>
				<Grid item xs>
					<Typography align="right" variant="body1" gutterBottom>
						This site is 100% organically homegrown using <a className={classes.link} target="_blank" href="https://reactjs.org/">React</a> and <a className={classes.link} target="_blank" href="https://material.io/design/">Material Design</a>. 
					</Typography>
					<Typography align="right" variant="body1" gutterBottom>
						Source code is freely available <a className={classes.link} target="_blank" href="https://github.com/alcarasj/jerico-xyz">here</a>. 
					</Typography>
					<Typography align="right" variant="body2" gutterBottom>
						BUILD 0.0.6
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
};