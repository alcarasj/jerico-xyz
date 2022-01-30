import React, { FC, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Toolbar, AppBar, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import SocialBar from './SocialBar';
import TypingText from './TypingText';
import { sendAPIRequest } from '../utils/Helpers';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawerContent: {
      minWidth: 300
    }
  }),
);

interface ClientData {
  readonly address: string;
  readonly location: string;
}

const CustomAppBar: FC = (): JSX.Element => {
  const classes = useStyles();
  const [clientData, setClientData] = useState<ClientData>({ address: '', location: '' });
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    sendAPIRequest<ClientData>('/api/client').then(data => setClientData(data)).catch(() => setClientData({ address: '', location: '' }));
  }, []);

  return (
    <AppBar id='appbar' color='inherit'>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="primary"
          aria-label="menu"
          onClick={() => setIsDrawerOpen(true)}
          size="large">
          <MenuIcon />
        </IconButton>
        <Drawer
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
        >
          <Box
            className={classes.drawerContent}
            role="presentation"
            onClick={() => setIsDrawerOpen(false)}
            onKeyDown={() => setIsDrawerOpen(false)}
          >
            <List>
              <ListItemButton onClick={() => navigate('/')} selected={window.location.pathname === '/'}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/dev')} selected={window.location.pathname === '/dev'}>
                <ListItemIcon>
                  <DeveloperBoardIcon />
                </ListItemIcon>
                <ListItemText primary={"Dev"} />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
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