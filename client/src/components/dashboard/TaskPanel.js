import React, { useEffect, useState } from "react";
import useAxiosRes from "../../hooks/useAxiosRes";

import { Paper, Stack, Typography } from "@mui/material";
import TaskCard from "../tasks/TaskCard";

const TaskPanel = () => {
	// Tracks the 3 categories of tasks
	const [todayTasks, setTodayTasks] = useState([]);
	const [sharedTodayTasks, setSharedTodayTasks] = useState([]);

	const axiosRes = useAxiosRes();
	useEffect(() => {
		axiosRes.get("/task").then((response) => {
			setTodayTasks(response.data.todayTasks);
		});

		axiosRes.get("/task/shared").then((response) => {
			setSharedTodayTasks(response.data.sharedTodayTasks);
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
						You have {sharedTodayTasks.length + todayTasks.length} tasks due
						today
					</Typography>
					{sharedTodayTasks.map((task) => (
						<TaskCard task={task} key={task._id} shared />
					))}
					{todayTasks.map((task) => (
						<TaskCard task={task} key={task._id} />
					))}
				</Stack>
			</Paper>
		</>
	);
};

export default TaskPanel;
