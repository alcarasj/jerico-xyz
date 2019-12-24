import React from "react";
import { Hello } from "../components/Hello";

export interface HomePageProps { compiler: string; framework: string; }

export const HomePage = (props: HomePageProps) => {
	
	return (
		<div>
		<Hello compiler={props.compiler} framework={props.framework}/>
		<h2>This site is currently under construction. Stay tuned!</h2>
		<h3>- Jerico</h3>
		</div>
	);
};