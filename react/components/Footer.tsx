import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
	}),
);

export interface FooterProps {};

export const FooterProps = (props: FooterProps) => {
	const classes = useStyles({});

	return (
		<div>
		</div>
	);
}