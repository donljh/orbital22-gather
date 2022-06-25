import React, { useState, useEffect } from "react";
import { Paper, Stack, Typography, Card, CardContent } from "@mui/material";
import useAxiosRes from "../../hooks/useAxiosRes";

const EventCard = (props) => {
	const event = props.event;
	const { title, description, startDate, endDate } = event;

	const startDateDisplay = new Date(startDate).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const endDateDisplay = new Date(endDate).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Card sx={{ backgroundColor: "#323232" }}>
			<CardContent sx={{ py: 1 }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography
						sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
						variant="h6"
						component="span"
						color="#e2e2e2"
						fontWeight="semi-bold"
						gutterBottom
					>
						{title}
					</Typography>
				</Stack>
				<Typography
					variant="button"
					component="span"
					color="#e2e2e2"
					gutterBottom
				>
					{`${startDateDisplay} - ${endDateDisplay}`}
				</Typography>
				<Typography
					sx={{ textOverflow: "ellipsis" }}
					variant="body2"
					component="p"
					color="#676767"
				>
					{description}
				</Typography>
			</CardContent>
		</Card>
	);
};

const EventPanel = () => {
	const [events, setEvents] = useState([]);

	const axiosRes = useAxiosRes();

	useEffect(() => {
		const now = new Date().setHours(0, 0, 0, 0);

		axiosRes.get("/event").then((response) => {
			console.log(response.data.events);
			setEvents(
				response.data.events.filter((event) => {
					const start = new Date(event.startDate).setHours(0, 0, 0, 0);
					const end = new Date(event.endDate).setHours(0, 0, 0, 0);
					return start <= now && end >= now;
				})
			);
		});
	}, [axiosRes]);

	return (
		<>
			<Paper
				sx={{
					background: "#282828",
					borderRadius: "20px",
				}}
			>
				<Stack py={"1.5rem"} spacing={"1.5rem"} mx={2}>
					<Typography variant="h6" color="orange" textAlign="center">
						You have {events.length} events scheduled for today
					</Typography>
					{events.map((event) => (
						<EventCard key={event._id} event={event} />
					))}
				</Stack>
			</Paper>
		</>
	);
};

export default EventPanel;
