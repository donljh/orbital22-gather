import { Box, Card, Divider, Stack, TextField, Typography, IconButton, Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/system';
import useAxiosRes from '../hooks/useAxiosRes';

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

const profileDisplayStyle = {
  width: 600,
  bgcolor: '#282828',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  borderRadius: '20px',
  py: 3
}

const ProfileFieldDisplay = (props) => {
  return <TextField
            focused 
            color="warning" 
            sx={{ width: '60%' }} 
            name={props.name}
            label={props.label} 
            value={props.value} 
            onChange={props.onChange}
            inputProps={{ 
              type: props.type,
              style: {color: 'white'}, 
              disabled: props.disableInput}}  />
}

const EditFieldButton = (props) => {
  return (
    <IconButton 
      disableRipple 
      sx={{color: 'white'}} 
      onClick={props.onClick}>
      <EditIcon />
    </IconButton>
  )
}

const ProfileFieldChangeModal = (props) => {
  const { open, onClose, field } = props;

  const axiosRes = useAxiosRes();
  
  let path;

  if (field === "name") {
    path = '/profile/change_name';
  } else if (field === "email") {
    path = '/users/change_email';
  } else if (field === "password") {
    path = '/users/change_password'
  }

  const initialFieldData = {
    previousValue: '',
    newValue: ''
  }

  const [fieldData, setFieldData] = useState(initialFieldData);

  const { previousValue, newValue } = fieldData;

  const handleTextFieldChange = e => {
    setFieldData({ ...fieldData, [e.target.name]: e.target.value })
    console.log(fieldData)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Stack alignItems={'center'} spacing={4} pt={4} >
          <ProfileFieldDisplay type={field} name="previousValue" value={previousValue} onChange={handleTextFieldChange} label={`Enter your previous ${field}`}/>
          <ProfileFieldDisplay type={field} name="newValue" value={newValue} onChange={handleTextFieldChange} label={`Enter your new ${field}`}/>
          <Button color="success" variant="contained">Save</Button>
        </Stack>
      </Box>
    </Modal>
  )
}

const Profile = () => {
  const [nameChangeModalOpen, setNameChangeModalOpen] = useState(false);
  const [emailChangeModalOpen, setEmailChangeModalOpen] = useState(false);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const openNameChangeModal = () => setNameChangeModalOpen(true);
  const closeNameChangeModal = () => setNameChangeModalOpen(false);

  const openEmailChangeModal = () => setEmailChangeModalOpen(true);
  const closeEmailChangeModal = () => setEmailChangeModalOpen(false);

  const openPasswordChangeModal = () => setPasswordChangeModalOpen(true);
  const closePasswordChangeModal = () => setPasswordChangeModalOpen(false);

  const axiosRes = useAxiosRes();

  useEffect(() => {
    axiosRes.get('/user')
    .then(response => setEmail(response.data.email))
    .catch(err => console.log(err));
    
    axiosRes
    .get('/profile')
    .then(response => setName(response.data.name))
    .catch(err => console.log(err));
  })  

  return (  
    <Box sx={profileDisplayStyle}>
      <Stack spacing={8} mb={4}>
        <Typography mt={2} variant="h4" fontWeight="bold">Your Profile</Typography>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR NAME" value={name} />
          <EditFieldButton onClick={openNameChangeModal}/>
          <ProfileFieldChangeModal open={nameChangeModalOpen} onClose={closeNameChangeModal} field="name"/>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR EMAIL ADDRESS"  value={email} />
          <EditFieldButton onClick={openEmailChangeModal}/>
          <ProfileFieldChangeModal open={emailChangeModalOpen} onClose={closeEmailChangeModal} field="email"/>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR PASSWORD" value={"********"} />
          <EditFieldButton onClick={openPasswordChangeModal} />
          <ProfileFieldChangeModal open={passwordChangeModalOpen} onClose={closePasswordChangeModal} field="password"/>
        </Box>

      </Stack>
      <Button variant="contained" color="error">Deregister</Button>
    </Box>
  )
}

export default Profile;