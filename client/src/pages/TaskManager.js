import React, { useState, useEffect } from 'react';
import useAxiosRes from '../hooks/useAxiosRes';

import CreateTaskForm from '../components/TaskManager/CreateTaskForm';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/Edit'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};




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

const TaskPanelHeader = (props) => {
  const [open, setOpen] = useState(false);

  const { selectedCategory } = props;

  const openCreateTaskForm = () => setOpen(true);
  const closeCreateTaskForm = () => setOpen(false);

  const now = new Date()
    .toLocaleDateString(
      'en-GB', 
      { weekday: 'long', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      }
    );  

  return (
    <>
      <Stack py={2} direction='row' justifyContent='space-between' sx={{borderBottom: '1px #e2e2e2 solid'}}>
        <Stack spacing={2} direction='row'>
          <Typography variant='h4' color='#e2e2e2' fontWeight='bold' textTransform="uppercase">{selectedCategory}</Typography>
          {selectedCategory === 'today' ? (
            <>
              <Divider orientation='vertical' sx={{ background: '#e2e2e2'}} />
              <Typography variant='h6' sx={{ color: '#676767' }}>{now}</Typography>
            </>
          ) : (<></>)}
        </Stack>
        <Button color='success' variant='contained' size='small' onClick={openCreateTaskForm}  sx={{ borderRadius: '20px' }} startIcon={<AddOutlinedIcon />}> New Task </Button>       
      </Stack> 

      <Modal open={open} onClose={closeCreateTaskForm} >
        <Box sx={modalStyle}>
          <CreateTaskForm setIsTaskListModified={props.setIsTaskListModified}/>
        </Box> 
      </Modal>

    </>
  )
}

const TaskCard = (props) => {
  const [completed, setCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const axiosRes = useAxiosRes();

  const {_id, title, description, dueDate} = props.task;
  const displayDate = new Date(dueDate).toLocaleString('en-GB', { day: 'numeric', month:'short' })

  const completeTask = e => {
    axiosRes.delete(`/task/${_id}`)
    .then(response => setCompleted(true))
    .catch(err => console.log(err));
  }

  const openEditTaskForm = () => setOpen(true);
  const closeEditTaskForm = () => setOpen(false);

  return (
    completed ? <></> :
    <>
      <Card sx={{ backgroundColor: '#282828'}}>
        <CardContent sx={{ py: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis'}} gutterBottom variant="h6" color="#e2e2e2" component="span" fontWeight='semi-bold'>{title}</Typography>
            <Stack direction="row">
              <Checkbox disableRipple checked={completed} onChange={completeTask} color="primary"/>
              <IconButton disableRipple onClick={openEditTaskForm}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Typography gutterBottom variant="button" color="#e2e2e2" component="span">{`${displayDate}`}</Typography>
          <Typography variant="body2" color="#676767" component="p" sx={{ textOverflow: 'ellipsis' }}>{description}</Typography>
        </CardContent>
      </Card>

      <Modal open={open} onClose={closeEditTaskForm} >
          <Box sx={modalStyle}>
            <EditTaskForm task={props.task} setIsTaskListModified={props.setIsTaskListModified}/>
          </Box> 
      </Modal>
    </>
  )
}

const TaskPanel = (props) => {
  const {category, selectedCategory, tasks} = props;

  return(
    (category !== selectedCategory ? <></> :
    <Box px={'25%'}>
      <TaskPanelHeader selectedCategory={selectedCategory} setIsTaskListModified={props.setIsTaskListModified} />
      <Stack py={'1.5rem'} spacing={'1.5rem'} mx={2}>
        {tasks.map(task => <TaskCard setIsTaskListModified={props.setIsTaskListModified} task={task} key={task._id} />) }
      </Stack>
    </Box>
  ))
}

const TaskManager = () => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isTaskListModified, setIsTaskListModified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('today');

  const axiosRes = useAxiosRes();

  const handleCategoryButtonClick = e => {
    setSelectedCategory(e.target.value);
  }

  useEffect(() => {
    axiosRes.get('/task').then(response => {
      setIsTaskListModified(false);
      setOverdueTasks(response.data.overdueTasks);
      setTodayTasks(response.data.todayTasks);
      setUpcomingTasks(response.data.upcomingTasks);  
    })   
  }, [axiosRes, isTaskListModified])

  return (
    <>
      <Stack justifyContent='center' mt={3} spacing={2} direction='row' divider={<Divider orientation='vertical' flexItem sx={{ background: '#e2e2e2'}} />}>
      <Button variant='contained' sx={{ borderRadius: '20px' }} value="overdue" onClick={handleCategoryButtonClick}>Overdue</Button>
        <Button variant='contained' sx={{ borderRadius: '20px' }} value="today" onClick={handleCategoryButtonClick}>Today</Button>
        <Button variant='contained' sx={{ borderRadius: '20px' }} value="upcoming" onClick={handleCategoryButtonClick}>Upcoming</Button>
      </Stack>

      <TaskPanel category="overdue" setIsTaskListModified={setIsTaskListModified} selectedCategory={selectedCategory} tasks={overdueTasks}></TaskPanel>
      <TaskPanel category="today" setIsTaskListModified={setIsTaskListModified} selectedCategory={selectedCategory} tasks={todayTasks}></TaskPanel>
      <TaskPanel category="upcoming" setIsTaskListModified={setIsTaskListModified} selectedCategory={selectedCategory} tasks={upcomingTasks}></TaskPanel>
    </>
    )
}

export default TaskManager;