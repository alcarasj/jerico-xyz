import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import SocialBar from './SocialBar';
import TypingText from './TypingText';
import { sendAPIRequest } from '../utils/Helpers';
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  React.useEffect(() => {
    sendAPIRequest('/client').then(data => setClientData(data)).catch(() => setClientData({ address: '', location: '' }));
  }, []);

  return (
    <AppBar id={props.id} color='inherit'>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="primary"
          aria-label="menu"
          onClick={() => navigate('/', { replace: true })}
          size="large">
          <HomeIcon />
        </IconButton>
        <TypingText 
          variant="h6" 
          messages={[
            { getText: () => "jerico.xyz", color: 'primary' },
            { getText: () => "Welcome to my website!" },
            { getText: () => `The local time is ${new Date().toLocaleString()}.` },
            ... (clientData.address ? [{ getText: () => `Your detected IP address is ${clientData.address}.` }] : []),
            ... (clientData.location ? [{ getText: () => `Your detected location is ${clientData.location}.`}] : []),
          ]} 
          className={classes.title}
        />
        <SocialBar />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;