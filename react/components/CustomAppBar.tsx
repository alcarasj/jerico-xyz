import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { GithubCircle, Linkedin } from 'mdi-material-ui';
import { Data } from '../utils/Data';
import MailIcon from '@material-ui/icons/Mail';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	}),
);

interface HideOnScrollProps {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window?: () => Window;
	children: React.ReactElement;
}

const HideOnScroll = (props: HideOnScrollProps) => {
	const { children, window } = props;
	const trigger = useScrollTrigger({ target: window ? window() : undefined });
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

type ActionType = {
	type: 'redirect'
};

const reducer = (state, action: ActionType) => {
	switch (action.type) {
		default: {
			return state
		}
	};
};


export interface CustomAppBarProps {};

export const CustomAppBar = (props: CustomAppBarProps) => {
	const classes = useStyles({});

	const [state, dispatch] = React.useReducer(reducer, {
	});

	return (
		<div className={classes.root}>
			<HideOnScroll>
				<AppBar>
					<Toolbar>
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							<HomeIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							jerico.xyz
						</Typography>
						<a href={Data.linkedinURL} target="_blank">
							<IconButton aria-label="linkedin">
								<Linkedin />
							</IconButton>
						</a>
						<a href={Data.githubURL} target="_blank">
							<IconButton aria-label="github">
								<GithubCircle />
							</IconButton>
						</a>
						<a href={"mail:to" + Data.email} target="_blank">
							<IconButton aria-label="email">
								<MailIcon />
							</IconButton>
						</a>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
		</div>
	);
}