import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Paper, Typography } from "@mui/material";
import useAxiosRes from "../hooks/useAxiosRes";
import EventPanel from "../components/dashboard/EventPanel";
import { styled } from "@mui/system";
import TaskPanel from "../components/dashboard/TaskPanel";

/**
 * Dashboard is the main display page of the web application when a user
 * is successfully logged in/registered.
 */

function Dashboard() {
	const axiosRes = useAxiosRes();
	const [profile, setProfile] = useState({});

	const now = new Date().toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	useEffect(() => {
		axiosRes.get("/profile").then((response) => {
			setProfile(response.data);
		});
	}, [axiosRes]);

	return (
		<Grid container spacing={3} py={4} px={"25%"}>
			<Grid item xs={12}>
				<Paper
					sx={{
						background: "#282828",
						textAlign: "center",
						borderRadius: "20px",
						paddingBlock: "12px",
					}}
					elevation={3}
				>
					<Typography variant="h4" color="orange">
						{profile.name + "'s dashboard"}
					</Typography>
					<Typography variant="h5" color="white">
						{now}
					</Typography>
				</Paper>
			</Grid>
			<Grid item xs={6}>
				<EventPanel />
			</Grid>
			<Grid item xs={6}>
				<TaskPanel />
			</Grid>
		</Grid>
	);
}

export default Dashboard;
