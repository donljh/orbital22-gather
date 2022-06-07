import React, { useState, useEffect } from 'react';
import useAxiosRes from '../hooks/useAxiosRes';

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import TaskPanel from '../components/tasks/TaskPanel';

const TaskManager = () => {
  
  // Tracks the 3 categories of tasks
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Default selected category is 'today' --> shows tasks for the current day
  const [selectedCategory, setSelectedCategory] = useState('today');

  // Tracks if a task has been added/edited
  const [isTaskListModified, setIsTaskListModified] = useState(false);

  const axiosRes = useAxiosRes();

  // Handles the category of tasks to be displayed
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
      <Stack 
          mt={3} 
          spacing={2}  
          direction='row' 
          justifyContent='center' 
          divider={<Divider orientation='vertical' sx={{ background: '#e2e2e2'}} />}>
        {
          ['overdue', 'today', 'upcoming'].map(category => 
          <Button 
            sx={{ borderRadius: '20px', background: '#282828' }}
            variant='contained'
            value={category}
            onClick={handleCategoryButtonClick}>
            {category}
          </Button>)
        }
      </Stack>

      {
        [['overdue', overdueTasks],
         ['today', todayTasks],
         ['upcoming', upcomingTasks]].map(category => 
          <TaskPanel 
            category={category[0]} 
            tasks={category[1]}
            selectedCategory={selectedCategory}
            setIsTaskListModified={setIsTaskListModified}
          />)
      }
    </>
    )
}

export default TaskManager;