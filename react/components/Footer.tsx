import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Github, Linkedin } from 'mdi-material-ui';
import IconButton from '@material-ui/core/IconButton';
import { GITHUB_URL, LINKEDIN_URL, EMAIL } from "../utils/Settings";
import MailIcon from '@material-ui/icons/Mail';
import packageJSON = require('../../package.json');


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

const Footer: React.FC = () => {
  const classes = useStyles();
  const packageVersion = packageJSON.version;

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
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              <IconButton aria-label="linkedin">
                <Linkedin />
              </IconButton>
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <IconButton aria-label="github">
                <Github />
              </IconButton>
            </a>
            <a href={"mailto:" + EMAIL} target="_blank" rel="noreferrer">
              <IconButton aria-label="email">
                <MailIcon />
              </IconButton>
            </a>
          </Grid>
        </Grid>
        <Grid item xs>
          <Typography align="right" variant="body1" gutterBottom>
						This site is 100% homegrown using <a className={classes.link} target="_blank" rel="noreferrer" href="https://reactjs.org/">React</a> and <a className={classes.link} target="_blank" rel="noreferrer" href="https://material-ui.com/">Material UI</a>. 
          </Typography>
          <Typography align="right" variant="body1" gutterBottom>
						Source code is freely available <a className={classes.link} target="_blank" href="https://github.com/alcarasj/jerico-xyz" rel="noreferrer">here</a>. 
          </Typography>
          <Typography align="right" variant="body2" gutterBottom>
						BUILD { packageVersion }
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Footer;