import { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import useAxiosRes from '../../hooks/useAxiosRes';

const CreateTaskForm = (props) => {
  const initialTaskData = {
    title: '',
    description: '',
    dueDate: Date.now()
  }

  const [taskData, setTaskData] = useState(initialTaskData);

  const { title, description, dueDate } = taskData;

  const handleTextFieldChange = e => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value })
  }

  const axiosRes = useAxiosRes();

  const createNewTask = async () => {
    const task = taskData
    axiosRes.post('/task', task)
    .then(response => {
      setTaskData(initialTaskData);
      props.setIsTaskListModified(true);
    })
    .catch(err => console.log(err.data));
  }

  return(
    <form>
      <Stack mb={4} spacing={4}>
        <Typography variant="h6" textAlign='center'>Creating A New Task</Typography>
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
        onClick={createNewTask} 
        disabled={!title}>
        Create Task
        </Button>
    </form>
  )
}

export default CreateTaskForm;