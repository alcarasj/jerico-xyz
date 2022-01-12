/* eslint-disable */

import React from 'react';
import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

type ActionType = {
	type: 'redirect'
};

const reducer = (state, action: ActionType) => {
  switch (action.type) {
  default: {
    return state
  }
  }
};

export interface ComponentProps {}

export const Component: React.FC = (props: ComponentProps): JSX.Element => {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(reducer, {
  });

  return (
    <div>
    </div>
  );
}