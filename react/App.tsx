import React from "react";
import  { HomePage } from "./pages/HomePage";

export interface AppProps { compiler: string; framework: string; }

export const App = (props: AppProps) =>  {

	return (
		<HomePage compiler={props.compiler} framework={props.framework}/>
	);

};