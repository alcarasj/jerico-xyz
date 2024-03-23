import React, { FC, lazy, Suspense } from "react";
import Footer from "./Footer";
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { STATIC_DIR } from '../utils/Settings';
import CustomAppBar from "./CustomAppBar";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { Grid, Grow } from "@mui/material";

const HomePage = lazy(() => import('../pages/HomePage'));
const DevPage = lazy(() => import('../pages/DevPage'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100vw',
      backgroundImage: "url(" + STATIC_DIR + "img/bg.jpg)",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    },
    page: {
      paddingTop: theme.spacing(25),
      paddingLeft: "5vw",
      paddingRight: "5vw",
      paddingBottom: theme.spacing(20)
    },
    embedPlayer: {
      marginTop: theme.spacing(10),
      maxWidth: 500
    },
  }),
);

const App: FC = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Router>
      <ScrollToTop />
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.page}>
          <CustomAppBar />
          <Routes>
            <Route path="/dev" element={
              <Suspense fallback={<div>Loading...</div>}>
                <DevPage />
              </Suspense>
            } />
            <Route path="/" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            } />
          </Routes>
          <Grid container alignItems='center' justifyContent='center'>
            <Grow in timeout={1500}>
              <iframe className={classes.embedPlayer} width="100%" height="450" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1632166630&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
            </Grow>
          </Grid>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;