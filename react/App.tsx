import React from "react";
import { HomePage } from "./pages/HomePage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";

const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: orange,
		secondary: blue
	}
});

export interface AppProps { compiler: string; framework: string; }

export const App = (props: AppProps) =>  {

	return (
		<MuiThemeProvider theme={theme}>
			<HomePage compiler={props.compiler} framework={props.framework}/>
		</MuiThemeProvider>
	);

};