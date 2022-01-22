import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { AppState, AppAction } from '../utils/Types';
import TypingText from '../components/TypingText';
import { Grow, Grid, Avatar, Card, CardContent, Typography } from '@mui/material';
import { STATIC_DIR, DEV_XP_CARDS } from "../utils/Settings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    me: {
      height: theme.spacing(30),
      width: theme.spacing(30)
    },
    cardContainer: {
      width: 500,
    },
    card: {
      minWidth: "100%"
    }
  })
);

interface MonthYearDate {
  month: 1|2|3|4|5|6|7|8|9|10|11|12,
  year: number;
}

interface Experience {
  from: MonthYearDate;
  to: MonthYearDate;
  employer: string;
  description: string;
}

export interface DevPageProps {
  state: AppState;
  dispatch: (action: AppAction) => void;
  enqueueSnackbar: (message: string, options?: unknown) => string | number;
}

const DevPage: React.FC<DevPageProps> = (props: DevPageProps): JSX.Element => {
  const classes = useStyles();

  const getExperienceTimeRange = (from: MonthYearDate, to: MonthYearDate) => `${new Date(from.year, --from.month).toLocaleString('default', { month: 'short' })} ${from.year} ` + 
    `- ${to ? `${new Date(to.year, --to.month).toLocaleString('default', { month: 'short' })} ${to.year}` : "present"}`;

  const renderExperienceCards = (): JSX.Element => (
    <Grid item xs>
      <Grid container spacing={1} alignItems='flex-start' justifyContent='center' flexDirection="column">
        { 
          DEV_XP_CARDS.map((xp: Experience) => (
            <Grid item xs={12} key={xp.employer} className={classes.cardContainer}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    { xp.employer }
                  </Typography>
                  <Typography gutterBottom>
                    { getExperienceTimeRange(xp.from, xp.to) }
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    { xp.description }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Grid>
  );

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3}>
      <Grid item xs>
        <Grow in timeout={750}>
          <Avatar className={classes.me} alt="Jerico Alcaras" src={STATIC_DIR + "img/jerico-2019-460x460.jpg"}/>
        </Grow>
      </Grid>
      <Grid item xs>
        <TypingText 
          align="center"
          variant="h3"
          component="h1"
          messages={[
            { getText: () => 'Hi! My name is Jerico.' },
            { getText: () => 'I\'m a software engineer at IBM Cloud.', color: 'secondary' },
          ]}
        />
        <TypingText 
          align="center"
          variant="subtitle1"
          component="h1"
          gutterBottom
          messages={[
            { getText: () => 'I\'m currently specializing in full-stack software development and dev-ops.' },
            { getText: () => 'Feel free to contact me to learn more!' },
            { getText: () => '(I\'m still building this page, check back later!)' },
          ]}
        />
      </Grid>
      { renderExperienceCards() }
    </Grid>
  );
};

export default DevPage;