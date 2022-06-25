import React, { useEffect, useState } from 'react'
import useAxiosRes from '../../../hooks/useAxiosRes';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import CreateSharedEventForm from './CreateSharedEventForm';
import EditSharedEventForm from './EditSharedEventForm';
import SharedEventPopup from './SharedEventPopup';

const GroupCalendar = (props) => {

  const groupID = props.groupID;

  // Array that holds all event details
  const [eventsArray, setEventsArray] = useState([]);

  const axiosRes = useAxiosRes();

  // Open variable for event popup
  const [eventOpen, setEventOpen] = useState(false);
  const openEvent = () => setEventOpen(true);
  const closeEvent = () => setEventOpen(false);

  // Open variable for create event form
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  // Open variable for edit event form
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  // Event details variable
  const initialEventData = {
    title: '',
    description: '',
    start: '',
    end: ''
  }
  const [eventData, setEventData] = useState(initialEventData);

  const [isEventsModified, setIsEventsModified] = useState(false);

  const handleEventClick = (arg) => {
    const newStartDate = new Date(arg.event.extendedProps.startDate);
    const newEndDate = new Date(arg.event.extendedProps.endDate);
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    setEventData({
      ...eventData,
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      start: newStartDate.toLocaleDateString(undefined, dateOptions),
      end: newEndDate.toLocaleDateString(undefined, dateOptions),
      id: arg.event.extendedProps._id
    });
    openEvent();
  }

  const handleEventMouseEnter = (arg) => {
    arg.el.style.backgroundColor = '#c7b936';
    arg.el.style.borderColor = '#c7b936';
  }

  const handleEventMouseLeave = (arg) => {
    arg.el.style.backgroundColor = '#318ba3';
    arg.el.style.borderColor = '#318ba3';
  }
  
  // Handle edit event click
  const editEvent = () => {
    closeEvent();
    openForm();
  }

  const [initDate, setInitDate] = useState(Date.now());

  // Handle date clicked
  const dateClicked = (d) => {
    setInitDate(d.date);
    setCreateOpen(true);
  }

  // Retrive events from database and update events
  useEffect(() => {
    axiosRes.get(`/group/${groupID}/sharedevents`).then(response => {
      setIsEventsModified(false);
      let data = response.data.events.map((e) => {
        e.start = e.startDate;
        e.end = e.endDate;
        return e;
      });
      setEventsArray(data);
    })
  }, [axiosRes, isEventsModified])

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        events={eventsArray}
        eventColor='#318ba3'
        eventDisplay='block'
        displayEventTime={false}
        dateClick={dateClicked}
        customButtons={{
          newEventButton: {
            text: 'New Event',
            click() {
              setInitDate(Date.now());
              openCreate();
            }
          }
        }}
        headerToolbar={{
          left: 'newEventButton',
          center: 'title',
          right: 'today,prev,next'
        }}
        buttonText={{
          today: 'Today'
        }}
      />
      <Modal
        open={eventOpen}
        onClose={closeEvent}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div><SharedEventPopup
          eventData={eventData}
          closeEvent={closeEvent}
          editEvent={editEvent}
          setIsEventsModified={setIsEventsModified}
          groupID={groupID}
        /></div>
      </Modal>
      <Modal
        open={createOpen}
        onClose={closeCreate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div><CreateSharedEventForm
          initDate={initDate}
          setIsEventsModified={setIsEventsModified}
          closeForm={closeCreate}
          groupID={groupID}
        /></div>
      </Modal>
      <Modal
        open={formOpen}
        onClose={closeForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div><EditSharedEventForm
          eventData={eventData}
          setIsEventsModified={setIsEventsModified}
          closeForm={closeForm}
          groupID={groupID}
        /></div>
      </Modal>
    </div>
  )
}

export default GroupCalendar