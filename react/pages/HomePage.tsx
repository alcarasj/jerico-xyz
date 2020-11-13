import React from "react";
import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { HOME_CARDS, STATIC_DIR, INITIAL_APP_STATE } from "../utils/Settings";
import { atLimit } from '../utils/Helpers';
import { withSnackbar } from 'notistack';
import AppReducer from '../utils/Reducer';
import {
  getExhibits,
  setCounter,
  setImage,
  verifyImage
} from '../utils/ActionCreators';

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
    body: {
      paddingTop: theme.spacing(15)
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
  enqueueSnackbar: (message: string, options?: unknown) => string | number;
}

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { enqueueSnackbar } = props;
  const classes = useStyles();
  const [state, dispatch] = React.useReducer(AppReducer, INITIAL_APP_STATE);

  React.useEffect(() => {
    getExhibits(dispatch);
  }, []);

  const renderCards = () => (
    <Grid item xs>
      <Grid container spacing={1} alignItems='flex-start' justify='center'>
        { 
          HOME_CARDS.map((card, index) => (
            <Grow key={card.title} in timeout={1200 + (index * 250)}>
              <Grid item xs={12} className={classes.cardContainer}>
                <Card className={classes.card}>
                  <CardActionArea>
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
                        const newValue = state.counter + 1;
                        if (atLimit(newValue)) {
                          enqueueSnackbar('You have unlocked the image verifier!', { variant: 'success' });
                        }
                        dispatch(setCounter(newValue));
                      }}
                    >
                        Coming soon™
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

  const renderImageVerifier = () => (
    <Grid item xs>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Image Verifier
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              This feature verifies the checksum of any art file made by me.
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <input
            accept="image/*"
            id="upload-image-for-verify"
            type="file"
            onChange={event => dispatch(setImage(event.target.files[0]))}
          />
          <Button 
            color="primary" 
            size="large"
            onClick={() => verifyImage(dispatch)}
            disabled={!state.imageFileURL}
          >
            {  !state.imageFileURL ? "Please provide a file" : "Check authenticity" }
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Grid className={classes.body} container justify="center" alignItems="center" direction="column" spacing={3}>
      <Grid item xs>
        <Grow in timeout={750}>
          <Avatar className={classes.me} alt="Jerico Alcaras" src={STATIC_DIR + "img/jerico-2019-460x460.jpg"}/>
        </Grow>
      </Grid>
      <Grid item xs>
        <Grow in timeout={1000}>
          <Typography align="center" variant="h3" component="h1">Hi! My name is Jerico.</Typography>
        </Grow>
        <Grow in timeout={1200}>
          <Typography align="center" variant="subtitle1" gutterBottom>
            {
              atLimit(state.counter) ? "Thanks for supporting a good cause!" :
                "Thanks for visiting! Select an area of interest below to learn more about me."
            }
          </Typography>
        </Grow>
      </Grid>
      { atLimit(state.counter) ? renderImageVerifier() : renderCards() }
    </Grid>
  );
};
export default  withSnackbar(HomePage);