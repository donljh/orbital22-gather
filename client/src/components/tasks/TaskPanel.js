import React, { useState } from "react";

import CreateTaskForm from "./CreateTaskForm";
import TaskCard from "./TaskCard";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import CreateTagForm from "../tags/CreateTagForm";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import useAxiosRes from "../../hooks/useAxiosRes";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Header = (props) => {
  const [createTaskFormOpen, setCreateTaskFormOpen] = useState(false);
  const [createTagFormOpen, setCreateTagFormOpen] = useState(false);

  const { selectedCategory, tags } = props;

  const openCreateTaskForm = () => setCreateTaskFormOpen(true);
  const closeCreateTaskForm = () => setCreateTaskFormOpen(false);

  const openCreateTagForm = () => setCreateTagFormOpen(true);
  const closeCreateTagForm = () => setCreateTagFormOpen(false);

  const now = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Stack
        sx={{ borderBottom: "1px #e2e2e2 solid" }}
        direction="row"
        py={2}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h4"
            color="#e2e2e2"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {selectedCategory}
          </Typography>
          {selectedCategory === "today" ? (
            <>
              <Divider orientation="vertical" sx={{ background: "#e2e2e2" }} />
              <Typography variant="h6" sx={{ color: "#676767" }}>
                {now}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            sx={{ borderRadius: "20px" }}
            startIcon={<AddOutlinedIcon />}
            color="success"
            variant="contained"
            size="small"
            onClick={openCreateTagForm}
          >
            New Tag
          </Button>
          <Button
            sx={{ borderRadius: "20px" }}
            startIcon={<AddOutlinedIcon />}
            color="success"
            variant="contained"
            size="small"
            onClick={openCreateTaskForm}
          >
            New Task
          </Button>
        </Stack>
      </Stack>

      <Modal open={createTaskFormOpen} onClose={closeCreateTaskForm}>
        <Box sx={modalStyle}>
          <CreateTaskForm
            setIsTaskListModified={props.setIsTaskListModified}
            tags={tags}
          />
        </Box>
      </Modal>

      <Modal open={createTagFormOpen} onClose={closeCreateTagForm}>
        <Box sx={modalStyle}>
          <CreateTagForm setIsTagListModified={props.setIsTagListModified} />
        </Box>
      </Modal>
    </>
  );
};

const TaskPanel = (props) => {
  const {
    category,
    selectedCategory,
    tasks,
    sharedTasks,
    tags,
    selectedTag,
    setSelectedTag,
  } = props;

  const axiosRes = useAxiosRes();

  const deleteTag = async (tagId) => {
    await axiosRes
      .delete(`tags/${tagId}`)
      .then((response) => {
        props.setIsTagListModified(true);
        props.setIsTaskListModified(true);
        setSelectedTag("all");
      })
      .catch((err) => console.log(err));
  };

  return category !== selectedCategory ? (
    <></>
  ) : (
    <Box px={"25%"}>
      <Header
        selectedCategory={selectedCategory}
        setIsTaskListModified={props.setIsTaskListModified}
        setIsTagListModified={props.setIsTagListModified}
        tags={tags}
      />
      <Stack py={"1.5rem"} spacing={"1.5rem"} mx={2}>
        <FormControl focused sx={{ maxWidth: 200 }}>
          <InputLabel>View By Tag</InputLabel>
          <Select
            label="View By Tag"
            sx={{ color: "white" }}
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <MenuItem value="all" defaultChecked>
              All
            </MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
                <IconButton onClick={() => deleteTag(tag._id)} edge="end">
                  <ClearIcon />
                </IconButton>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {sharedTasks.map((task) => (
          <TaskCard
            task={task}
            key={task._id}
            shared
            setIsTaskListModified={props.setIsTaskListModified}
          />
        ))}
        {tasks.map((task) =>
          task.tags.some((tag) => tag._id === selectedTag) ||
          selectedTag === "all" ? (
            <TaskCard
              task={task}
              key={task._id}
              setIsTaskListModified={props.setIsTaskListModified}
              createdTags={tags}
            />
          ) : (
            <></>
          )
        )}
      </Stack>
    </Box>
  );
};

export default TaskPanel;
