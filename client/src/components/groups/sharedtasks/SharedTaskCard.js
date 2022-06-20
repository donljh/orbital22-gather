import React, { useState } from 'react';
import useAxiosRes from '../../../hooks/useAxiosRes';

import EditSharedTaskForm from './EditSharedTaskForm';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/Edit'
import { CardActions } from '@mui/material';

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

const SharedTaskCard = (props) => {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const axiosRes = useAxiosRes();

  const { setIsTaskListModified } = props
  const task = props.task;

  const { _id, title, description, dueDate } = task;
  const acceptedMembers = task.accepted;
  const completedMembers = task.completed;
  const groupID = task.group;

  const displayDate = new Date(dueDate)
    .toLocaleString('en-GB', { day: 'numeric', month:'short' })

  const deleteTask = () => {
    axiosRes.delete(`/group/${groupID}/sharedtasks/${_id}`)
      .then(response => setIsTaskListModified(true))
      .catch(console.log);
  }

  const acceptTask = () => {
    axiosRes.patch(`/group/${groupID}/sharedtasks/${_id}/accepted`)
      .then(response => {
        setAccepted(true)
        setIsTaskListModified(true)
      })
      .catch(console.log)
  }

  const openEditSharedTaskForm = () => setOpen(true);
  const closeEditSharedTaskForm = () => setOpen(false);

  return(
    accepted 
      ? <></>
      : <>
          <Card sx={{ backgroundColor: '#282828'}}>
            <CardContent sx={{ py: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography 
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis'}} 
                  variant="h6" component="span" 
                  color="#e2e2e2" fontWeight='semi-bold' 
                  gutterBottom>
                  {title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip color="success" label={`${completedMembers.length} completed`}></Chip>
                  <Chip color="warning" label={`${acceptedMembers.length} accepted`}></Chip>
                  <Checkbox 
                    disableRipple 
                    onChange={deleteTask} color="primary"/>
                  <IconButton disableRipple onClick={openEditSharedTaskForm}>
                    <EditIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Typography 
                variant="button" component="span" 
                color="#e2e2e2" gutterBottom>
                {`${displayDate}`}
              </Typography>
              <Typography sx={{ textOverflow: 'ellipsis' }} 
                variant="body2" component="p" 
                color="#676767">
                {description}
              </Typography>
            </CardContent>
            {
              (props.category === "pending") &&
              <CardActions>
                <Button color="success" variant="contained" onClick={acceptTask}>
                  Accept
                </Button>
              </CardActions>
            }
          </Card>

          <Modal open={open} onClose={closeEditSharedTaskForm} >
              <Box sx={modalStyle}>
                <EditSharedTaskForm 
                  task={props.task} 
                  setIsTaskListModified={props.setIsTaskListModified}/>
              </Box> 
          </Modal>
        </>
  )
}

export default SharedTaskCard;