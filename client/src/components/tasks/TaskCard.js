import React, { useState } from "react";
import useAxiosRes from "../../hooks/useAxiosRes";

import EditTaskForm from "./EditTaskForm";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

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

const SharedTaskCard = (props) => {
  const [completed, setCompleted] = useState(false);
  const axiosRes = useAxiosRes();

  const task = props.task;
  const { _id, title, description, dueDate } = task;

  const displayDate = new Date(dueDate).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const completeTask = () => {
    axiosRes
      .patch(`/group/${task.group._id}/sharedtasks/${_id}/completed`)
      .then((response) => setCompleted(true))
      .catch((err) => console.log(err));
  };

  return completed ? (
    <></>
  ) : (
    <>
      <Card sx={{ backgroundColor: "#282828" }}>
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
              {title + " "}
              <Chip
                label={`${task.group.name}`}
                variant="outlined"
                color="warning"
                size="small"
              ></Chip>
            </Typography>
            <Stack direction="row">
              <Checkbox
                disableRipple
                checked={completed}
                onChange={completeTask}
                color="primary"
              />
            </Stack>
          </Stack>
          <Typography
            variant="button"
            component="span"
            color="#e2e2e2"
            gutterBottom
          >
            {`${displayDate}`}
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
    </>
  );
};

const PersonalTaskCard = (props) => {
  const [completed, setCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const axiosRes = useAxiosRes();

  const task = props.task;
  const { _id, title, description, dueDate, tags } = task;

  const displayDate = new Date(dueDate).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const completeTask = () => {
    axiosRes
      .delete(`/task/${_id}`)
      .then((response) => setCompleted(true))
      .catch((err) => console.log(err));
  };

  const openEditTaskForm = () => setOpen(true);
  const closeEditTaskForm = () => setOpen(false);

  return completed ? (
    <></>
  ) : (
    <>
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
              {title + " "}
              {tags.map((tag) => (
                <Chip
                  key={tag._id}
                  label={`${tag.name}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "white",
                    borderColor: tag.colorHex,
                    backgroundColor: tag.colorHex,
                  }}
                ></Chip>
              ))}
            </Typography>
            <Stack direction="row">
              <Checkbox
                disableRipple
                checked={completed}
                onChange={completeTask}
                color="primary"
              />
              <IconButton disableRipple onClick={openEditTaskForm}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Typography
            variant="button"
            component="span"
            color="#e2e2e2"
            gutterBottom
          >
            {`${displayDate}`}
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

      <Modal open={open} onClose={closeEditTaskForm}>
        <Box sx={modalStyle}>
          <EditTaskForm
            task={props.task}
            setIsTaskListModified={props.setIsTaskListModified}
            createdTags={props.createdTags}
          />
        </Box>
      </Modal>
    </>
  );
};

const TaskCard = (props) => {
  return props.shared ? (
    <SharedTaskCard {...props} />
  ) : (
    <PersonalTaskCard {...props} />
  );
};

export default TaskCard;
