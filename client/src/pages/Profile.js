import { Box, Card, Divider, Stack, TextField, Typography, IconButton, Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import React, { useState } from 'react'

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
            variant={props.variant}  
            label={props.label} 
            value={props.value} 
            inputProps={{ 
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

const FieldChangeForm = (props) => {

  return (
    <Box sx={modalStyle}>
    <Stack alignItems={'center'} spacing={4} pt={4} >
      <ProfileFieldDisplay label={`Re-enter your previous ${props.field}`}/>
      <ProfileFieldDisplay label={`Enter your new ${props.field}`}/>
      <Button color="success" variant="contained">Save</Button>
    </Stack>
  </Box>
  )
}

const Profile = () => {
  const [nameChangeModalOpen, setNameChangeModalOpen] = useState(false);
  const [emailChangeModalOpen, setEmailChangeModalOpen] = useState(false);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);

  const openNameChangeModal = () => setNameChangeModalOpen(true);
  const closeNameChangeModal = () => setNameChangeModalOpen(false);

  const openEmailChangeModal = () => setEmailChangeModalOpen(true);
  const closeEmailChangeModal = () => setEmailChangeModalOpen(false);

  const openPasswordChangeModal = () => setPasswordChangeModalOpen(true);
  const closePasswordChangeModal = () => setPasswordChangeModalOpen(false);

  return (
    <>    
    <Box sx={profileDisplayStyle}>
      <Stack spacing={8} mb={4}>
        <Typography mt={2} variant="h4" fontWeight="bold">Your Profile</Typography>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR NAME" value={"name"} />
          <EditFieldButton onClick={openNameChangeModal}/>
          <Modal open={nameChangeModalOpen} onClose={closeNameChangeModal}>
            <FieldChangeForm field='name' />
          </Modal>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR EMAIL ADDRESS"  value={"email123123123123123123123123123131231231"} />
          <EditFieldButton onClick={openEmailChangeModal}/>
          <Modal open={emailChangeModalOpen} onClose={closeEmailChangeModal}>
            <FieldChangeForm field='email' />
          </Modal>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR PASSWORD" value={"********"} />
          <EditFieldButton onClick={openPasswordChangeModal} />
          <Modal open={passwordChangeModalOpen} onClose={closePasswordChangeModal}>
            <FieldChangeForm field='password' />
          </Modal>
        </Box>

      </Stack>
      <Button variant="contained" color="error">Deregister</Button>
    </Box>



    </>
  )
}

export default Profile;