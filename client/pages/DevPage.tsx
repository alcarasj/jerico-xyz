import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TypingText from '../components/TypingText';
import { Grow, Grid, Avatar, Card, CardContent, Typography, Chip } from '@mui/material';
import { STATIC_DIR, DEV_XP_CARDS } from "../utils/Settings";
import ImageClassifier from '../components/ImageClassifier';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    me: {
      height: theme.spacing(30),
      width: theme.spacing(30)
    },
    cardContainer: {
      width: 350,
    },
    card: {
      minWidth: "100%"
    },
    tagsContainer: {
      marginTop: theme.spacing(1),
      width: "100%"
    },
    imageClassifier: {
      marginTop: theme.spacing(10),
      width: 400
    }
  })
);

interface MonthYearDate {
  readonly month: number,
  readonly year: number;
}

interface Experience {
  readonly from: MonthYearDate;
  readonly to?: MonthYearDate;
  readonly employer: string;
  readonly description: string;
  readonly tags: string[];
}

const DevPage: React.FC = (): JSX.Element => {
  const classes = useStyles();

  const getExperienceTimeRange = (from: MonthYearDate, to: MonthYearDate) => `${new Date(from.year, from.month - 1).toLocaleString('default', { month: 'short' })} ${from.year} ` +
    `- ${to ? `${new Date(to.year, to.month - 1).toLocaleString('default', { month: 'short' })} ${to.year}` : "present"}`;

  const renderExperienceCards = (): JSX.Element => (
    <Grid item xs>
      <Grid container spacing={1} alignItems='flex-start' justifyContent='center' flexDirection="column">
        {
          DEV_XP_CARDS.map((xp: Experience, index: number) => (
            <Grow key={xp.employer} in timeout={1200 + (index * 250)}>
              <Grid item xs={12} className={classes.cardContainer}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {xp.employer}
                    </Typography>
                    <Typography gutterBottom>
                      {getExperienceTimeRange(xp.from, xp.to)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {xp.description}
                    </Typography>
                    <Grid className={classes.tagsContainer} container justifyContent="flex-start" alignItems="center" spacing={1}>
                      {xp.tags.map(tag => <Grid item key={tag}><Chip color="primary" label={tag} /></Grid>)}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          ))
        }
      </Grid>
    </Grid>
  );

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3}>
      <Grid item xs>
        <Grow in timeout={750}>
          <Avatar className={classes.me} alt="Jerico Alcaras" src={STATIC_DIR + "img/jerico-2024-460x460.jpg"} />
        </Grow>
      </Grid>
      <Grid item xs>
        <TypingText
          align="center"
          variant="h3"
          component="h1"
          messages={[
            { getText: () => 'Hi! My name is Jerico.' },
            { getText: () => 'I\'m a software engineer at Microsoft.', color: 'primary' },
          ]}
        />
        <TypingText
          align="center"
          variant="subtitle1"
          component="h1"
          gutterBottom
          messages={[
            { getText: () => 'I\'m currently specializing in product development and dev-ops.' },
            { getText: () => 'Feel free to contact me to learn more!' },
            { getText: () => '(I\'m still building this page, check back later!)' },
          ]}
        />
      </Grid>
      {renderExperienceCards()}
      <Grow in timeout={1000}>
        <Grid item xs className={classes.imageClassifier}>
          <ImageClassifier />
        </Grid>
      </Grow>
    </Grid>
  );
};

export default DevPage;