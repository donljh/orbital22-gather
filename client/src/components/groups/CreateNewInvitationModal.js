import React, { useState } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography';

import useAxiosRes from '../../hooks/useAxiosRes';


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

const CreateNewInvitationModal = (props) => {
  const { open, onClose } = props;

  const [inviteeEmail, setInviteeEmail] = useState('');

  const onChange = e => {
    setInviteeEmail(e.target.value)
  }

  const axiosRes = useAxiosRes();

  const createNewInvitation = async () => {
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <Stack spacing={4} mb={4} >
        <Typography variant="h6" color="white" textAlign='center'>Inviting A User</Typography>
        <TextField 
          color="warning"
          name="inviteeemail"
          value={inviteeEmail}
          label="Invitee Email" 
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
      <Button 
        disabled={!inviteeEmail} color="success" 
        variant="contained" onClick={createNewInvitation}>
        Send Invite
      </Button>
      </Box>   
    </Modal>
  )
}

export default CreateNewInvitationModal;