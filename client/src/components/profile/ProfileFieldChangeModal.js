import React, { useState } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack';

import ProfileFieldDisplay from './ProfileFieldDisplay';

import useAxiosRes from '../../hooks/useAxiosRes';

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

const ProfileFieldChangeModal = (props) => {
  const { open, onClose, field, setIsUpdated } = props;

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const axiosRes = useAxiosRes();

  const handleTextFieldChange = e => {
    setValue(e.target.value);
  }

  const handleSubmit = async () => {

    let path;
    let data;

    if (field === "name") {
      path = '/profile/change_name';
      data = { name: value}
    } else if (field === "email") {
      path = '/user/change_email';
      data = { email: value }
    } else if (field === "password") {
      path = '/user/change_password'
      data = { password: value }
    }

    axiosRes.patch(path, data)
    .then(() => {
      onClose();
      setIsUpdated(true)
    })
    .catch(err => {
      setError(true)
      setHelperText(err.message)
      console.log(err)
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Stack alignItems={'center'} spacing={4} pt={4} >
          <ProfileFieldDisplay error={error} helperText={helperText} type={field} name="newValue" value={value} onChange={handleTextFieldChange} label={`Enter your new ${field}`}/>
          <Button color="success" variant="contained" onClick={handleSubmit} disabled={(value === '')}>Save</Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default ProfileFieldChangeModal;