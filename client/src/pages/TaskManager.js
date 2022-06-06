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

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/Edit'

const todaysTask = [{ 
  _id: "1",
  title: "Today's Task", 
  description: 'Sample Task Description', 
  dueDate: "05 June"
}]
const upcomingTask= [{ 
    _id: "1",
    title: "Upcoming Task", 
    description: 'Sample Task Description', 
    dueDate: "05 June"
}]

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

const TaskManagerHeader = (props) => {
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
          <CreateTaskForm />
        </Box> 
      </Modal>

    </>
  )
}

const TaskCard = (props) => {
  const {title, description, dueDate} = props.task;

  const displayDate = new Date(dueDate).toLocaleString('en-GB', { day: 'numeric', month:'short' })

  return (
    <Card sx={{ backgroundColor: '#282828' }}>
      <CardContent sx={{ py: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis'}} gutterBottom variant="h6" color="#e2e2e2" component="span" fontWeight='semi-bold'>{title}</Typography>
          <Stack direction="row">
            <Checkbox disableRipple color="primary"/>
            <IconButton disableRipple>
              <EditIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Typography gutterBottom variant="button" color="#e2e2e2" component="span">{`${displayDate}`}</Typography>
        <Typography variant="body2" color="#676767" component="p" sx={{ textOverflow: 'ellipsis' }}>{description}</Typography>
      </CardContent>
    </Card>
  )
}

const TaskPanel = (props) => {
  const {category, selectedCategory, tasks} = props;

  const displayValue = (category !== selectedCategory) ? 'none' : 'block' 

  console.log(tasks);

  return(
    <div style={{ display: displayValue }}>
      <Stack py={'1.5rem'} spacing={'1.5rem'} mx={2}>
        {tasks.map(task => <TaskCard task={task} key={task._id} />) }
      </Stack>
    </div>
  )
}

const TaskManager = () => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('today');

  const axiosRes = useAxiosRes();

  const handleCategoryButtonClick = e => {
    setSelectedCategory(e.target.value);
  }

  useEffect(() => {
    axiosRes.get('/task').then(response => {
      setOverdueTasks(response.data.overdueTasks);
      setTodayTasks(response.data.todayTasks);
      setUpcomingTasks(response.data.upcomingTasks);  
    })   
  }, [axiosRes])

  return (
    <>
      <Stack justifyContent='center' mt={3} spacing={2} direction='row' divider={<Divider orientation='vertical' flexItem sx={{ background: '#e2e2e2'}} />}>
      <Button variant='contained' sx={{ borderRadius: '20px' }} value="overdue" onClick={handleCategoryButtonClick}>Overdue</Button>
        <Button variant='contained' sx={{ borderRadius: '20px' }} value="today" onClick={handleCategoryButtonClick}>Today</Button>
        <Button variant='contained' sx={{ borderRadius: '20px' }} value="upcoming" onClick={handleCategoryButtonClick}>Upcoming</Button>
      </Stack>

      <Box px={'25%'}>
        <TaskManagerHeader selectedCategory={selectedCategory} />
        <TaskPanel category="overdue" selectedCategory={selectedCategory} tasks={overdueTasks}></TaskPanel>
        <TaskPanel category="today" selectedCategory={selectedCategory} tasks={todayTasks}></TaskPanel>
        <TaskPanel category="upcoming" selectedCategory={selectedCategory} tasks={upcomingTasks}></TaskPanel>
      </Box>
    </>
    )
}

export default TaskManager;