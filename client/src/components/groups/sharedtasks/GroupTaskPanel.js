import React, { useState } from 'react';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import InitiateSharedTaskForm from './InitiateSharedTaskForm';
import SharedTaskCard from './SharedTaskCard'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

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

const Header = (props) => {
  const [open, setOpen] = useState(false);

  const { selectedCategory, groupID } = props;

  const openCreateSharedTaskForm = () => setOpen(true);
  const closeCreateSharedTaskForm = () => setOpen(false);


  return (
    <>
      <Stack 
        sx={{borderBottom: '1px #e2e2e2 solid'}} 
        direction='row' py={2} justifyContent='space-between'>
        <Stack direction='row' spacing={2}>
          <Typography 
            variant='h4' color='#e2e2e2' 
            fontWeight='bold' textTransform="uppercase">
            {selectedCategory}
          </Typography>
        </Stack>
        <Button 
          sx={{ borderRadius: '20px' }} startIcon={<AddOutlinedIcon />} 
          color='success' variant='contained' size='small' 
          onClick={openCreateSharedTaskForm}> 
          Initiate Task 
        </Button>       
      </Stack> 

      <Modal open={open} onClose={closeCreateSharedTaskForm} >
        <Box sx={modalStyle}>
          <InitiateSharedTaskForm groupID={groupID} setIsTaskListModified={props.setIsTaskListModified}/>
        </Box> 
      </Modal>
    </>
  )
}

const GroupTaskPanel = (props) => {
  const {category, selectedCategory, groupID, tasks} = props;

  return(
    (category !== selectedCategory) 
      ? <></> 
      : <Box px={'10%'}>
          <Header 
            groupID={groupID}
            selectedCategory={selectedCategory} 
            setIsTaskListModified={props.setIsTaskListModified} 
          />
          <Stack py={'1.5rem'} spacing={'1.5rem'} mx={2}>
            {tasks.map(task => 
              <SharedTaskCard category={category} task={task} key={task._id} 
                setIsTaskListModified={props.setIsTaskListModified}
              />)}
          </Stack>
        </Box>
  )
}

export default GroupTaskPanel;