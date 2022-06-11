import React from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosAuth } from '../../api/axios';
import useUser from '../../hooks/useUser';
import useLogout from '../../hooks/useLogout'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Container } from '@mui/system';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#282828',
  boxShadow: 24,
  textAlign: 'center',
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};

const CreateNewGroupModal = (props) => {
  const { open, onClose } = props;

  const onChange = e => {
    console.log(e.target.value)
  }
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <Stack spacing={4} mb={4} >
        <Typography variant="h6" color="white" textAlign='center'>Creating New Group</Typography>
        <TextField 
          color="warning"
          name="groupName"
          label="Group Name" 
          variant="outlined" 
          onChange={onChange}
          focused
          inputProps={{ 
            style: { 
              color: 'white' 
            }
          }}
          required/>
      </Stack>
      <Button color="success" variant="contained">Create Group</Button>
      </Box>   
    </Modal>
  )
}

export default CreateNewGroupModal;