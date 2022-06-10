import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = () => {
  return (
    <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin ]}
        initialView="dayGridMonth"
        events={[
          { title: 'event 1', date: '2022-06-01' },
          { title: 'event 2', date: '2022-06-03' }
        ]}
    />
  )
}

export default Calendar