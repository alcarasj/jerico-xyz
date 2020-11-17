import React from "react";
import HomePage from "./pages/HomePage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import Footer from "./components/Footer";
import orange from "@material-ui/core/colors/orange";
import Grid from "@material-ui/core/Grid";
import Grow from '@material-ui/core/Grow';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { STATIC_DIR, INITIAL_APP_STATE } from './utils/Settings';
import AppReducer from './utils/Reducer';
import CustomAppBar from "./components/CustomAppBar";
import { withSnackbar } from 'notistack';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: red,
    secondary: orange
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
});

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
      paddingTop: theme.spacing(15),
      paddingBottom: theme.spacing(20),
    },
    paper: {
      backgroundImage: "url(" + STATIC_DIR + "img/bg.jpg)",
      paddingLeft: "5vw",
      paddingRight: "5vw"
    },
    embedPlayer: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10)
    },
  }),
);

interface AppProps {
  enqueueSnackbar: (message: string, options?: unknown) => string | number;
}

const App: React.FC<AppProps> = ({ enqueueSnackbar }: AppProps): JSX.Element => {
  const classes = useStyles();
  const [state, dispatch] = React.useReducer(AppReducer, INITIAL_APP_STATE);

  return (
    <MuiThemeProvider theme={theme}>    
      <CssBaseline />
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Router>
            <CustomAppBar id='appbar'/>
            <Switch>
              <Route path="/">
                <HomePage 
                  state={state} 
                  dispatch={dispatch} 
                  enqueueSnackbar={enqueueSnackbar} 
                />
              </Route>
            </Switch>
            <Grid container alignItems='center' justify='center'>
              <Grow in timeout={1500}>
                <iframe className={classes.embedPlayer} width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/545610837&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
              </Grow>
            </Grid>
          </Router>
        </Paper>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
};

export default withSnackbar(App);