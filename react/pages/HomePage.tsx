import React from "react";
import { CustomAppBar } from "../components/CustomAppBar";

export interface HomePageProps { compiler: string; framework: string; }

export const HomePage = (props: HomePageProps) => {
	
	return (
		<div>
			<CustomAppBar />
		</div>
	);
};