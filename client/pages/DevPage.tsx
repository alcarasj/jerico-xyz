import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import { AppState, AppAction } from '../utils/Types';
import TypingText from '../components/TypingText';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);

export interface DevPageProps {
  state: AppState;
  dispatch: (action: AppAction) => void;
  enqueueSnackbar: (message: string, options?: unknown) => string | number;
}

const DevPage: React.FC<DevPageProps> = (props: DevPageProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3}>
      <Grid item xs>
        <TypingText 
          align="center"
          variant="h3"
          component="h1"
          messages={[{ getText: () => 'Hi! My name is Jerico.' }]}
        />
        <TypingText 
          align="center"
          variant="subtitle1"
          component="h1"
          gutterBottom
          messages={[
            { getText: () => 'I\'m a software engineer at IBM Cloud Identity and Access Management.', color: 'secondary' },
            { getText: () => 'I\'m currently specializing in full-stack software development and dev-ops.' },
            { getText: () => 'Feel free to contact me to learn more!' },
            { getText: () => '(I\'m still building this page, check back later!)' },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default DevPage;