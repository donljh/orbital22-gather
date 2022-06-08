import { Box, Card, Divider, Stack, TextField, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import React from 'react'

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

const Profile = () => {
  return (    
    <Box sx={modalStyle} justifyContent>
      <Stack spacing={8}>
        <Typography mt={2} variant="h4" fontWeight="bold">Your Profile</Typography>
        <Box>
          <TextField variant="filled" color="warning" label="YOUR NAME" value={"samplename"} focused inputProps={{ style: {color: 'white'}, disabled: 'true'}}></TextField>
          <IconButton edge="end" sx={{color: 'white'}} disableRipple>
            <EditIcon />
          </IconButton>
        </Box>
        <Box>
        <TextField variant="filled" color="warning" label="YOUR EMAIL ADDRESS" value={"sampleemail@email.com"} focused inputProps={{ style: {color: 'white'}, disabled: 'true'}}></TextField>
          <IconButton edge="end" sx={{color: 'white'}} disableRipple>
            <EditIcon />
          </IconButton>
        </Box>
        <Box>
        <TextField variant="filled" color="warning" label="YOUR PASSWORD" value={'*********'} focused inputProps={{ style: {color: 'white'}, disabled: 'true'}}></TextField>
          <IconButton edge="end" sx={{color: 'white'}} disableRipple>
            <EditIcon />
          </IconButton>
        </Box>
        <Button color="error">Deregister</Button>
      </Stack>
    </Box>
  )
}

export default Profile;