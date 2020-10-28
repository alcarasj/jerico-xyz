import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Github, Linkedin } from 'mdi-material-ui';
import { Settings } from '../utils/Settings';
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

export const CustomAppBar: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar>
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
							jerico.xyz
        </Typography>
        <a href={Settings.LINKEDIN_URL} target="_blank" rel="noreferrer">
          <IconButton aria-label="linkedin">
            <Linkedin />
          </IconButton>
        </a>
        <a href={Settings.GITHUB_URL} target="_blank" rel="noreferrer">
          <IconButton aria-label="github">
            <Github />
          </IconButton>
        </a>
        <a href={"mailto:" + Settings.EMAIL} target="_blank" rel="noreferrer">
          <IconButton aria-label="email">
            <MailIcon />
          </IconButton>
        </a>
      </Toolbar>
    </AppBar>
  );
}