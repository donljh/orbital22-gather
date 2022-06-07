import { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import useAxiosRes from '../../hooks/useAxiosRes';

const EditTaskForm = (props) => {
  const {_id} = props.task;

  const initialTaskData = {
    title: props.task.title,
    description: props.task.description,
    dueDate: props.task.dueDate,
  }

  const [taskData, setTaskData] = useState(initialTaskData);

  const { title, description, dueDate } = taskData;

  const handleTextFieldChange = e => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value })
  }

  const axiosRes = useAxiosRes();

  const editTask = async () => {
    const task = taskData
    axiosRes.patch(`/task/${_id}`, task)
    .then(response => {
      setTaskData(task);
      props.setIsTaskListModified(true)
    })
    .catch(err => console.log(err.data));
  }

  return(
    <form>
      <Stack mb={4} spacing={4}>
        <Typography variant="h6" textAlign='center'>Editing Task</Typography>
        <TextField 
          name="title" 
          value={title}
          onChange={handleTextFieldChange} 
          label="Title" 
          variant="outlined" required/>
        <TextField 
          name="description" 
          value={description}
          onChange={handleTextFieldChange} 
          label="Description" 
          multiline variant="outlined" />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat='dd/MM/yyyy'
            name="dueDate"
            label="Due Date"
            value={dueDate}
            onChange={newDate => {
              setTaskData({ ...taskData, dueDate: newDate})
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Stack>  
      <Button 
        disableRipple
        variant="contained" 
        color="success" 
        onClick={editTask} 
        disabled={!title}>
        Done
        </Button>
    </form>
  )
}

export default EditTaskForm;