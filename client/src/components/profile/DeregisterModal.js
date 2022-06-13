import React from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAuth } from '../../api/axios';
import useUser from '../../hooks/useUser';
import useLogout from '../../hooks/useLogout'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#282828',
  boxShadow: 24,
  textAlign: 'center',
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};


const DeregisterModal = (props) => {
  const { open, onClose } = props;

  const navigate = useNavigate();
  const logout = useLogout();
  const { user } = useUser();

  const deregister = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`,
      }
    }
    axiosAuth.post('/deregister', [], config)
    .then(response => {
      logout();
    })
    .catch(err => console.log(err))
  }

  return(
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography gutterBottom variant="h4" color='white'>Are you sure you want to deregister your account?</Typography>
        <Button color="error" variant="contained" onClick={deregister}>Yes, I want to deregister my account</Button>
      </Box>
    </Modal>
  )
}

export default DeregisterModal;