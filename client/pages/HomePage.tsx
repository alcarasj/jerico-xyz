import React, { FC, useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button, CardActions, Grid, Grow, Card, CardActionArea, CardContent, ImageList, IconButton
  , ImageListItem, ImageListItemBar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { HOME_CARDS, STATIC_DIR } from "../utils/Settings";
import { atEasterEggCounterLimit, sendAPIRequest } from '../utils/Helpers';
import { useNavigate } from "react-router-dom";
import { EnqueueSnackbar, Exhibit } from '../utils/Types';
import TypingText from '../components/TypingText';
import { withSnackbar } from 'notistack';
import SiteMetrics from '../components/SiteMetrics';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    me: {
      height: theme.spacing(30),
      width: theme.spacing(30)
    },
    card: {
      height: '100%'
    },
    cardContainer: {
      maxWidth: 300
    }
  }),
);

interface Props {
  readonly enqueueSnackbar: EnqueueSnackbar;
}

interface HomeCard {
  readonly title: string;
  readonly description: string;
  readonly linkTo: string;
}

const HomePage: FC<Props> = (props: Props): JSX.Element => {
  const { enqueueSnackbar } = props;
  const [counter, setCounter] = useState<number>(0);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (atEasterEggCounterLimit(counter)) {
      sendAPIRequest<Exhibit[]>('/api/art')
        .then(exhibits => setExhibits(exhibits))
        .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
    }
  }, [counter]);

  const renderCards = (): JSX.Element => (
    <Grid item xs>
      <Grid container spacing={1} alignItems='flex-start' justifyContent='center'>
        { 
          HOME_CARDS.map((card: HomeCard, index: number) => (
            <Grow key={card.title} in timeout={1200 + (index * 250)}>
              <Grid item xs={12} className={classes.cardContainer}>
                <Card className={classes.card}>
                  <CardActionArea onClick={() => {
                    if (card.linkTo) {
                      navigate(card.linkTo);
                    } else {
                      enqueueSnackbar('Coming soon!', { variant: 'info' });
                    }
                  }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        { card.title }
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        { card.description }
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button 
                      size="small"
                      color="primary"
                      onClick={() => {
                        if (card.linkTo) {
                          navigate(card.linkTo);
                        } else {
                          const newValue = counter + 1;
                          if (atEasterEggCounterLimit(newValue)) {
                            enqueueSnackbar('You have unlocked my art exhibits!', { variant: 'success' });
                          }
                          setCounter(newValue);
                        }
                      }}
                    >
                      { card.linkTo ? "Learn more" : "Coming soon™" }
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grow>
          ))
        }
      </Grid>
    </Grid>
  );

  const renderExhibits = (): JSX.Element => (
    <Grow in timeout={750}>
      <Grid item xs>
        <ImageList>
          {
            exhibits.map(exhibit => (
              <ImageListItem key={exhibit.name}>
                <img src={exhibit.imageURL} alt={exhibit.name} />
                <ImageListItemBar
                  title={exhibit.name}
                  subtitle={<span>{`${exhibit.dateCreated}, ${exhibit.collection} Collection`}</span>}
                  actionIcon={
                    <IconButton
                      onClick={() => enqueueSnackbar('Coming soon!', { variant: 'info' })}
                      size="large">
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))
          }
        </ImageList>
      </Grid>
    </Grow>
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
          messages={[{ getText: () => 'Hi! My name is Jerico.' }]}
        />
        <TypingText 
          align="center"
          variant="subtitle1"
          component="h1"
          gutterBottom
          messages={[
            { 
              getText: () => atEasterEggCounterLimit(counter) ? 
                "Thanks for supporting my art!" :
                "Thanks for visiting! Select an area of interest below to learn more about me."
            }
          ]}
        />
      </Grid>
      { atEasterEggCounterLimit(counter) ? renderExhibits() : renderCards() }
      <Grid item>
        <SiteMetrics />
      </Grid>
    </Grid>
  );
};

export default withSnackbar(HomePage);