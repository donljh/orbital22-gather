import React, { useState } from 'react';
import useAxiosRes from '../../hooks/useAxiosRes';

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

const popupStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '4px solid #318ba3',
  boxShadow: 24,
  pb: 2
};

const EventPopup = (props) => {

  const axiosRes = useAxiosRes();

  const deleteEvent = () => {
    const id = props.eventData.id;
    axiosRes.delete(`/event/${id}`)
      .then(response => {
        props.closeEvent();
        props.setIsEventsModified(true);
      })
      .catch(err => console.log(err));
  }

  return (
    <div>
      <Box sx={popupStyle}>
        <IconButton onClick={props.closeEvent}>
          <CancelIcon />
        </IconButton>
        <Box px={2} mb={4}>
          <Typography id="modal-modal-title" sx={{ color: '#318ba3', fontWeight: 'bold' }} variant="h5" align='center'>
            {props.eventData.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }} align="left" style={{ wordWrap: "break-word" }}>
            Description: {props.eventData.description}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }} align="left" style={{ wordWrap: "break-word" }}>
            <b>Start</b>: {props.eventData.start} <br />
            <b>End</b>: {props.eventData.end}
          </Typography>
        </Box>
        {props.eventData.isGroupEvent === false
          ? (<>
            <Stack direction="row" justifyContent="center" spacing={1} px={2}>
              <Button
                variant="contained"
                onClick={props.editEvent} >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={deleteEvent} >
                Delete
              </Button>
            </Stack>
          </>)
          : (<></>)
        }
      </Box>
    </div>
  )
}

export default EventPopup;