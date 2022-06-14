import { useState } from 'react'

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
  const { open, onClose, groupID } = props;

  const initialInvitationData = {
    groupID,
    inviteeEmail: '',
    message: '',
  }

  const [invitationData, setInvitationData] = useState(initialInvitationData);
  const [errorMessage, setErrorMessage] = useState('');

  const { inviteeEmail, message } = invitationData;
  
  const onChange = e => {
    setInvitationData({...invitationData, [e.target.name]: e.target.value})
  }

  const axiosRes = useAxiosRes();

  const createNewInvitation = async () => {
    axiosRes.post('/invitation', invitationData)
      .then(response => {
        setInvitationData(initialInvitationData)
        onClose()
      }).catch(err => setErrorMessage(err.response.data.message))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Stack spacing={4} mb={4} >
          <Typography variant="h6" color="white" textAlign='center'>
            Inviting A User
          </Typography>
          {errorMessage 
            ? <Typography variant="subtitle" color="red">{errorMessage}</Typography> 
            : <></>}
          <TextField 
            color="warning"
            name="inviteeEmail"
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
            <TextField 
            color="warning"
            name="message"
            value={message}
            label="Invite Message" 
            variant="outlined" 
            onChange={onChange}
            focused
            inputProps={{ 
              style: { 
                color: 'white' 
              }
            }}/>
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