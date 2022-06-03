import React, { useState, useEffect } from "react";
import useAxiosRes from '../hooks/useAxiosRes';
import Box from '@mui/material/Box'
import { Typography, List, ListItem, ListItemText, Divider, Tabs, Tab, Button, Modal, Stack } from '@mui/material/'
import CreateTaskForm from "../components/CreateTaskForm";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// const overdueTasks = [1, 2, 3].map(n => {
//   return {title: `Overdue Task ${n}`, description: `Overdue Task Description ${n}`}
// })
// const todayTasks = [1, 2, 3].map(n => {
//   return {title: `Today Task ${n}`, description: `Today Task Description ${n}`}
// })
// const upcomingTasks = [1, 2, 3].map(n => {
//   return {title: `Upcoming Task ${n}`, description: `Upcoming Task Description ${n}`}
// })

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

const TaskManager = () => {
  const [category, setCategory] = useState("today");
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const openCreateTaskForm = () => setOpen(true);
  const closeCreateTaskForm = () => setOpen(false);

  const axiosRes = useAxiosRes();

  const handleChange = (event, newCategory) => {
    setCategory(newCategory);
  }

  useEffect(() => {
    axiosRes.get('/task').then(response => {
      setTasks(response.data)

    })   
  }, [axiosRes])

  return (
    <Box 
      justifyContent={'center'}
      px={60}
      py={3}
      sx={{ flexGrow: 1,
          boxSizing: 'border-box',
          border: 1,
          width: 1,
          bgcolor: 'lightgrey' }}>  

      <Stack 
        sx={{ borderBottom: 1, borderColor: 'divider' }} 
        direction="horizontal" 
        justifyContent="space-between">
        <Tabs value={category} onChange={handleChange} >
          <Tab label="OVERDUE" value="overdue"/>
          <Tab label="TODAY" value="today" />
          <Tab label="UPCOMING" value="upcoming"/>
        </Tabs>
        <Button onClick={openCreateTaskForm} startIcon={<AddOutlinedIcon />}>Create New Task</Button>    
      </Stack>
    
      <Modal open={open} onClose={closeCreateTaskForm} >
       <Box sx={modalStyle}>
          <CreateTaskForm />
       </Box> 
      </Modal>

    </Box>    
  )
}

export default TaskManager;