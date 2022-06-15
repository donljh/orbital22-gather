import { useState, useEffect } from 'react';
import useAxiosRes from '../../../hooks/useAxiosRes';

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import GroupTaskPanel from './GroupTaskPanel'

const GroupTaskManager = (props) => {
  const groupID = props.groupID;

  // Tracks the 3 categories of tasks
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  // Default selected category is 'today' --> shows tasks for the current day
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
      setAcceptedTasks(response.data.acceptedTasks);
      setPendingTasks(response.data.pendingTasks);
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
          ['pending', 'accepted'].map(category => 
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
          ['accepted', acceptedTasks]].map(category => 
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