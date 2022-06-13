import React, { createRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const popupStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};


const Calendar = () => {

  const calendarRef = createRef()
  // Array that holds all event details
  const eventsArray = [
    { title: 'event 1', details: 'event 1 details', start: '2022-06-01T10:30:00', end: '2022-06-02T10:40:00' },
    { title: 'event 2', details: 'event 2 details', date: '2022-06-12' }
  ]

  // Open variable for event popup
  const [eventOpen, setEventOpen] = React.useState(false);
  const openEvent = () => setEventOpen(true);
  const closeEvent = () => setEventOpen(false);

  const [eventName, setEventName] = React.useState('');
  const [eventDetails, setEventDetails] = React.useState('');

  const handleEventClick = (arg) => {
    setEventName(arg.event.title);
    setEventDetails(arg.event.extendedProps.details);
    openEvent();
  }

  const handleEventMouseEnter = (arg) => {
    arg.el.style.color = 'black';
  }

  return (
    <div>
      <FullCalendar
        ref = {calendarRef}
        plugins={[ dayGridPlugin, interactionPlugin ]}
        initialView="dayGridMonth"
        eventClick={handleEventClick}
        events={eventsArray}
        eventColor='#318ba3'
      />
      <Modal
        open={eventOpen}
        onClose={closeEvent}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={popupStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {eventName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {eventDetails}
          </Typography>
        </Box>
      </Modal>  
    </div>
  )
}

export default Calendar