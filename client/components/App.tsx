import React from "react";
import HomePage from "../pages/HomePage";
import DevPage from "../pages/DevPage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Footer from "./Footer";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { STATIC_DIR, INITIAL_APP_STATE } from '../utils/Settings';
import AppReducer from '../utils/Reducer';
import CustomAppBar from "./CustomAppBar";
import { withSnackbar } from 'notistack';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { Grid, Grow } from "@material-ui/core";


const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: lightBlue
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
      width: '100vw',
      backgroundImage: "url(" + STATIC_DIR + "img/bg.jpg)"
    },
    me: {
      height: theme.spacing(30),
      width: theme.spacing(30)
    },
    body: {
      paddingTop: theme.spacing(15),
      paddingBottom: theme.spacing(20),
    },
    page: {
      paddingTop: theme.spacing(25),
      paddingLeft: "5vw",
      paddingRight: "5vw",
      paddingBottom: theme.spacing(20)
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
    <Router>
      <ScrollToTop />
      <MuiThemeProvider theme={theme}>    
        <CssBaseline />
        <div className={classes.root}>
          <div className={classes.page}>
            <CustomAppBar id='appbar'/>
            <Routes>
              <Route path="/dev" element={
                <DevPage 
                  state={state} 
                  dispatch={dispatch} 
                  enqueueSnackbar={enqueueSnackbar} 
                />} />
              <Route path="/" element={
                <HomePage 
                  state={state} 
                  dispatch={dispatch} 
                  enqueueSnackbar={enqueueSnackbar} 
                />} />
            </Routes>
            <Grid container alignItems='center' justify='center'>
              <Grow in timeout={1500}>
                <iframe className={classes.embedPlayer} width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/545610837&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
              </Grow>
            </Grid>
          </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    </Router>
  );
};

export default withSnackbar(App);