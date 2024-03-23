import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import packageJSON = require('../../package.json');
import SocialBar from './SocialBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100vw",
      bottom: 0,
      padding: theme.spacing(10)
    },
    link: {
      color: "inherit"
    }
  }),
);

const Footer: FC = (): JSX.Element => {
  const classes = useStyles();
  const packageVersion = packageJSON.version;

  return (
    <Paper className={classes.root}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={3}>
        <Grid item xs>
          <Typography align="left" variant="body1" gutterBottom>
            {	`© JERICO ALCARAS ${new Date().getFullYear()}. All rights reserved.` }
          </Typography>
          <Typography align="left" variant="body1" gutterBottom>
            { "\"You miss 100% of the shots you don't take.\" -Albert Einstein" }
          </Typography>
        </Grid>
        <Grid container alignItems="center" justifyContent="center">
          <SocialBar />
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