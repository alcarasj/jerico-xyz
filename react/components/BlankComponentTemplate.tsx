import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
	};
};

export interface ComponentProps {};

export const Component = (props: ComponentProps) => {
	const classes = useStyles({});

	const [state, dispatch] = React.useReducer(reducer, {
	});

	return (
		<div>
		</div>
	);
}