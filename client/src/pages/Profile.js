import { Box, Card, Divider, Stack, TextField, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import React from 'react'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
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
  return <TextField sx={{ width: '60%' }} variant="filled" color="warning" label={props.label} value={props.value} focused inputProps={{ style: {color: 'white'}, disabled: 'true'}} />
}

const EditFieldButton = (props) => {
  return <IconButton edge="end" sx={{color: 'white'}} disableRipple><EditIcon /></IconButton>
}

const Profile = () => {
  return (    
    <Box sx={profileDisplayStyle}>
      <Stack spacing={8} mb={4}>
        <Typography mt={2} variant="h4" fontWeight="bold">Your Profile</Typography>
        <Box>
          <ProfileFieldDisplay label="YOUR NAME" value={"name"} />
          <EditFieldButton />
        </Box>
        <Box>
          <ProfileFieldDisplay label="YOUR EMAIL ADDRESS" value={"email123123123123123123123123123131231231"} />
          <EditFieldButton />
        </Box>
        <Box>
          <ProfileFieldDisplay label="YOUR PASSWORD" value={"********"} />
          <EditFieldButton />
        </Box>
      </Stack>
      <Button variant="contained" size="medium" color="error">Deregister</Button>
    </Box>
  )
}

export default Profile;