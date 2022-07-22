import { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import useAxiosRes from "../../hooks/useAxiosRes";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const EditTaskForm = (props) => {
  const { _id } = props.task;
  const createdTags = props.createdTags;

  const initialTaskData = {
    title: props.task.title,
    description: props.task.description,
    dueDate: props.task.dueDate,
    tags: props.task.tags.map((tag) => tag._id),
  };

  const [taskData, setTaskData] = useState(initialTaskData);

  const { title, description, dueDate, tags } = taskData;

  const handleTaskDataChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const axiosRes = useAxiosRes();

  const editTask = async () => {
    const task = taskData;
    console.log(task);
    axiosRes
      .patch(`/task/${_id}`, task)
      .then((response) => {
        setTaskData(task);
        props.setIsTaskListModified(true);
      })
      .catch((err) => console.log(err.data));
  };

  return (
    <form>
      <Stack mb={4} spacing={4}>
        <Typography variant="h6" textAlign="center">
          Editing Task
        </Typography>
        <TextField
          name="title"
          value={title}
          onChange={handleTaskDataChange}
          label="Title"
          variant="outlined"
          required
        />
        <TextField
          name="description"
          value={description}
          onChange={handleTaskDataChange}
          label="Description"
          multiline
          variant="outlined"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            name="dueDate"
            label="Due Date"
            value={dueDate}
            onChange={(newDate) => {
              setTaskData({ ...taskData, dueDate: newDate });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <FormControl>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={tags}
            label="Tags"
            name="tags"
            onChange={handleTaskDataChange}
          >
            {createdTags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Button
        disableRipple
        variant="contained"
        color="success"
        onClick={editTask}
        disabled={!title}
      >
        Done
      </Button>
    </form>
  );
};

export default EditTaskForm;
