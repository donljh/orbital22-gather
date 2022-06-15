import { useState, useEffect } from 'react';
import useAxiosRes from '../../../hooks/useAxiosRes';

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import GroupTaskPanel from './GroupTaskPanel'

const GroupTaskManager = (props) => {
  const groupID = props.groupID;

  // Tracks the 3 categories of tasks
  const [pendingTasks, setPendingTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([])

  // Default selected category is 'pending' --> shows tasks that user has not accepted
  const [selectedCategory, setSelectedCategory] = useState('pending');

  // Tracks if a task has been added/edited
  const [isTaskListModified, setIsTaskListModified] = useState(false);

  // Handles the category of tasks to be displayed
  const handleCategoryButtonClick = e => {
    setSelectedCategory(e.target.value);
  }

  const axiosRes = useAxiosRes();

  useEffect(() => {
    axiosRes.get(`/group/${groupID}/sharedtasks`).then(response => {
      setIsTaskListModified(false);
      setPendingTasks(response.data.pendingTasks);
      setAcceptedTasks(response.data.acceptedTasks);
      setCompletedTasks(response.data.completedTasks);
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
          ['pending', 'accepted', 'completed'].map(category => 
          <Button 
            key={category}
            sx={{ borderRadius: '20px', background: (category === selectedCategory) ? '' : '#282828' }}
            color="warning"
            variant='contained'
            value={category}
            onClick={handleCategoryButtonClick}>
            {category}
          </Button>)
        }
      </Stack>
      {
        [['pending', pendingTasks],
          ['accepted', acceptedTasks],
          ['completed', completedTasks]].map(category => 
          <GroupTaskPanel 
            groupID={groupID}
            key={category}
            category={category[0]} 
            tasks={category[1]}
            selectedCategory={selectedCategory}
            setIsTaskListModified={setIsTaskListModified}
          />)
      }
    </>
  )
}

export default GroupTaskManager