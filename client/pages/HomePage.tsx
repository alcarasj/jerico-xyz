import React from "react";
import Avatar from '@mui/material/Avatar';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button, CardActions, Grid, Grow, Card, CardActionArea, CardContent, ImageList, IconButton
  , ImageListItem, ImageListItemBar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { HOME_CARDS, STATIC_DIR } from "../utils/Settings";
import { atLimit } from '../utils/Helpers';
import {
  getExhibits,
  setCounter
} from '../utils/ActionCreators';
import { useNavigate } from "react-router-dom";
import { AppState, AppAction } from '../utils/Types';
import TypingText from '../components/TypingText';

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
    paper: {
      backgroundImage: `url(${STATIC_DIR}img/bg.jpg)`
    },
    card: {
      height: '100%'
    },
    cardContainer: {
      maxWidth: 300
    }
  }),
);

interface HomePageProps {
  state: AppState;
  dispatch: (action: AppAction) => void;
  enqueueSnackbar: (message: string, options?: unknown) => string | number;
}

interface HomeCard {
  title: string;
  description: string;
  linkTo: string;
}

const HomePage: React.FC<HomePageProps> = (props: HomePageProps): JSX.Element => {
  const { enqueueSnackbar, state, dispatch } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (atLimit(state.counter)) {
      getExhibits(dispatch);
    }
  }, [state.counter]);

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
                          const newValue = state.counter + 1;
                          if (atLimit(newValue)) {
                            enqueueSnackbar('You have unlocked my art exhibits!', { variant: 'success' });
                          }
                          dispatch(setCounter(newValue));
                        }
                      }}
                    >
                      { card.linkTo ? "Under construction!" : "Coming soon™" }
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
            state.exhibits.map(exhibit => (
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
              getText: () => atLimit(state.counter) ? 
                "Thanks for supporting my art!" :
                "Thanks for visiting! Select an area of interest below to learn more about me."
            }
          ]}
        />
      </Grid>
      { atLimit(state.counter) ? renderExhibits() : renderCards() }
    </Grid>
  );
};
export default  HomePage;