import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Container } from '@mui/system';

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

const CreateNewGroupModal = (props) => {
  const { open, onClose } = props;

  const [groupName, setGroupName] = useState('');

  const onChange = e => {
    setGroupName(e.target.value)
  }

  const axiosRes = useAxiosRes();

  const createNewGroup = async () => {
    axiosRes.post('/group', { groupName })
    .then(response => {
      setGroupName('');
      onClose();
    })
    .catch(err => console.log(err.data));
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <Stack spacing={4} mb={4} >
        <Typography variant="h6" color="white" textAlign='center'>Creating New Group</Typography>
        <TextField 
          color="warning"
          name="groupName"
          value={groupName}
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
      <Button 
        disabled={!groupName} color="success" 
        variant="contained" onClick={createNewGroup}>
        Create Group
      </Button>
      </Box>   
    </Modal>
  )
}

export default CreateNewGroupModal;