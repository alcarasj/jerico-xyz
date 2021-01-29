import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SocialBar from './SocialBar';
import TypingText from './TypingText';
import { sendAPIRequest } from '../utils/Helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface ClientData {
  address: string;
  location: string;
}

interface CustomAppBarProps {
  id: string;
}

const CustomAppBar: React.FC<CustomAppBarProps> = (props: CustomAppBarProps): JSX.Element => {
  const classes = useStyles();
  const [clientData, setClientData] = React.useState<ClientData>({ address: '', location: '' });

  React.useEffect(() => {
    sendAPIRequest('/client').then(data => setClientData(data)).catch(() => setClientData({ address: '', location: '' }));
  }, []);

  return (
    <AppBar id={props.id} color='inherit'>
      <Toolbar>
        <a href="/">
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="primary" 
            aria-label="menu"
          >
            <HomeIcon />
          </IconButton>
        </a>
        <TypingText 
          variant="h6" 
          messages={[
            { getText: () => "jerico.xyz", color: 'primary' },
            { getText: () => "Welcome to my website!" },
            { getText: () => `The local time is ${new Date().toLocaleString()}.` },
            ... clientData.address ? [{ getText: () => `Your detected IP address is ${clientData.address}.` }] : [],
            ... clientData.location ? [{ getText: () => `Your detected location is ${clientData.location}.`}] : [],
          ]} 
          className={classes.title}
        />
        <SocialBar />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;