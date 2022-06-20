import { Box, Stack, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import React, { useState, useEffect} from 'react'
import useAxiosRes from '../hooks/useAxiosRes';

import ProfileFieldDisplay from '../components/profile/ProfileFieldDisplay';
import ProfileFieldChangeModal from '../components/profile/ProfileFieldChangeModal'
import DeregisterModal from '../components/profile/DeregisterModal';



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

const Profile = () => {
  const [nameChangeModalOpen, setNameChangeModalOpen] = useState(false);
  const [emailChangeModalOpen, setEmailChangeModalOpen] = useState(false);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);
  const [deregisterModalOpen, setDeregisterModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const openNameChangeModal = () => setNameChangeModalOpen(true);
  const closeNameChangeModal = () => setNameChangeModalOpen(false);

  const openEmailChangeModal = () => setEmailChangeModalOpen(true);
  const closeEmailChangeModal = () => setEmailChangeModalOpen(false);

  const openPasswordChangeModal = () => setPasswordChangeModalOpen(true);
  const closePasswordChangeModal = () => setPasswordChangeModalOpen(false);

  const openDeregisterModal = () => setDeregisterModalOpen(true);
  const closeDeregisterModal = () => setDeregisterModalOpen(false);

  const axiosRes = useAxiosRes();

  useEffect(() => {
    setIsUpdated(false);
    axiosRes.get('/user')
    .then(response => setEmail(response.data.email))
    .catch(err => console.log(err));
    
    axiosRes
    .get('/profile')
    .then(response => setName(response.data.name))
    .catch(err => console.log(err));
  }, [isUpdated, axiosRes])  

  return (  
    <Box sx={profileDisplayStyle}>
      <Stack spacing={8} mb={4}>
        <Typography mt={2} variant="h4" fontWeight="bold">Your Profile</Typography>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR NAME" value={name} />
          <EditFieldButton onClick={openNameChangeModal}/>
          <ProfileFieldChangeModal setIsUpdated={setIsUpdated} open={nameChangeModalOpen} onClose={closeNameChangeModal} field="name"/>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR EMAIL ADDRESS"  value={email} />
          <EditFieldButton onClick={openEmailChangeModal}/>
          <ProfileFieldChangeModal setIsUpdated={setIsUpdated} open={emailChangeModalOpen} onClose={closeEmailChangeModal} field="email"/>
        </Box>

        <Box>
          <ProfileFieldDisplay disableInput label="YOUR PASSWORD" value={"********"} />
          <EditFieldButton onClick={openPasswordChangeModal} />
          <ProfileFieldChangeModal setIsUpdated={setIsUpdated} open={passwordChangeModalOpen} onClose={closePasswordChangeModal} field="password"/>
        </Box>

      </Stack>

      <Button variant="contained" color="error" onClick={openDeregisterModal}>Deregister</Button>
      <DeregisterModal open={deregisterModalOpen} onClose={closeDeregisterModal} />
    </Box>
  )
}

export default Profile;