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

const CreateNewAnnouncement = (props) => {
  const { open, onClose, groupID } = props;

  const initialAnnouncementData = {
    groupID,
    message: '',
  }

  const [announcementData, setAnnouncementData] = useState(initialAnnouncementData);

  const { message } = announcementData;
  
  const onChange = e => {
    setAnnouncementData({...announcementData, message: e.target.value})
  }

  const axiosRes = useAxiosRes();

  const createNewAnnouncement = async () => {
    axiosRes.patch(`/group/${groupID}/announcement`, announcementData)
      .then(response => {
        setAnnouncementData(initialAnnouncementData)
        onClose()
      }).catch(err => console.log(err.response.data.message))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Stack spacing={4} mb={4} >
          <Typography variant="h6" color="white" textAlign='center'>
            Add New Announcement
          </Typography>
          <TextField 
            color="warning"
            name="message"
            value={message}
            label="Announcement message" 
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
          disabled={!message} color="success" 
          variant="contained" onClick={createNewAnnouncement}>
          Done
        </Button>
      </Box>   
    </Modal>
  )
}

export default CreateNewAnnouncement;