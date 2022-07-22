import React, { useState, useEffect } from "react";
import useAxiosRes from "../hooks/useAxiosRes";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import TaskPanel from "../components/tasks/TaskPanel";

const TaskManager = () => {
  // Tracks the 3 categories of tasks
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const [sharedOverdueTasks, setSharedOverdueTasks] = useState([]);
  const [sharedTodayTasks, setSharedTodayTasks] = useState([]);
  const [sharedUpcomingTasks, setSharedUpcomingTasks] = useState([]);

  // Default selected category is 'today' --> shows tasks for the current day
  const [selectedCategory, setSelectedCategory] = useState("today");

  // Tracks if a task has been added/edited
  const [isTaskListModified, setIsTaskListModified] = useState(false);

  // Tracks if a tag has been added/edited
  const [tags, setTags] = useState([]);
  const [isTagListModified, setIsTagListModified] = useState(false);

  const [selectedTag, setSelectedTag] = useState("all");

  const axiosRes = useAxiosRes();

  // Handles the category of tasks to be displayed
  const handleCategoryButtonClick = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    axiosRes.get("/task").then((response) => {
      setIsTaskListModified(false);
      setOverdueTasks(response.data.overdueTasks);
      setTodayTasks(response.data.todayTasks);
      setUpcomingTasks(response.data.upcomingTasks);
    });

    axiosRes.get("/task/shared").then((response) => {
      setIsTaskListModified(false);
      setSharedOverdueTasks(response.data.sharedOverdueTasks);
      setSharedTodayTasks(response.data.sharedTodayTasks);
      setSharedUpcomingTasks(response.data.sharedUpcomingTasks);
    });
  }, [axiosRes, isTaskListModified]);

  useEffect(() => {
    axiosRes.get("/tags").then((response) => {
      setIsTagListModified(false);
      setTags(response.data);
    });
  }, [axiosRes, isTagListModified]);

  return (
    <>
      <Stack
        mt={3}
        spacing={2}
        direction="row"
        justifyContent="center"
        divider={
          <Divider orientation="vertical" sx={{ background: "#e2e2e2" }} />
        }
      >
        {["overdue", "today", "upcoming"].map((category) => (
          <Button
            key={category}
            sx={{
              borderRadius: "20px",
              background: category === selectedCategory ? "" : "#282828",
            }}
            color="warning"
            variant="contained"
            value={category}
            onClick={handleCategoryButtonClick}
          >
            {category}
          </Button>
        ))}
      </Stack>

      {[
        ["overdue", overdueTasks, sharedOverdueTasks],
        ["today", todayTasks, sharedTodayTasks],
        ["upcoming", upcomingTasks, sharedUpcomingTasks],
      ].map((category) => (
        <TaskPanel
          key={category}
          category={category[0]}
          tasks={category[1]}
          sharedTasks={category[2]}
          selectedCategory={selectedCategory}
          setIsTaskListModified={setIsTaskListModified}
          setIsTagListModified={setIsTagListModified}
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      ))}
    </>
  );
};

export default TaskManager;
