import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SocialBar from './SocialBar';
import TypingText from './TypingText';
import { TypingTextMessage } from '../utils/Types';

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

const MESSAGES: TypingTextMessage[] = [
  { getText: () => "jerico.xyz", color: 'primary' },
  { getText: () => "Welcome to my website!", color: 'inherit' },
  { getText: () => `The current date and time is ${new Date().toLocaleString()}.`, color: 'inherit' }
];

interface CustomAppBarProps {
  id: string;
}

const CustomAppBar: React.FC<CustomAppBarProps> = (props: CustomAppBarProps) => {
  const classes = useStyles();
  return (
    <AppBar id={props.id} color='inherit'>
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <HomeIcon />
        </IconButton>
        <TypingText variant="h6" messages={...MESSAGES} className={classes.title}/>
        <SocialBar />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;