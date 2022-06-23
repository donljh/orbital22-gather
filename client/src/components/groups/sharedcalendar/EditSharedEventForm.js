import { useState } from 'react';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import useAxiosRes from '../../../hooks/useAxiosRes';

const formStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const EditSharedEventForm = (props) => {

    const groupID = props.groupID;

    const initialEventData = {
        title: props.eventData.title,
        description: props.eventData.description,
        startDate: props.eventData.start,
        endDate: props.eventData.end
    }

    const [eventData, setEventData] = useState(initialEventData);

    const { title, description, startDate, endDate } = eventData;

    const handleTextFieldChange = e => {
        setEventData({ ...eventData, [e.target.name]: e.target.value })
    }

    const axiosRes = useAxiosRes();

    const editEvent = async () => {
        const id = props.eventData.id;
        const event = eventData
        axiosRes.patch(`/group/${groupID}/sharedevents/${id}`, event)
            .then(response => {
                setEventData(event);
                props.setIsEventsModified(true)
            })
            .catch(err => console.log(err.data));
        props.closeForm();
    }

    return (
        <Box sx={formStyle}>
            <form>
                <Stack mb={4} spacing={4}>
                    <Typography variant="h6" textAlign='center'>Editing An Event</Typography>
                    <TextField
                        name="title"
                        value={title}
                        onChange={handleTextFieldChange}
                        label="Title"
                        variant="outlined" required />
                    <TextField
                        name="description"
                        value={description}
                        onChange={handleTextFieldChange}
                        label="Description"
                        multiline variant="outlined" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Start Date"
                            value={startDate}
                            onChange={newDate => {
                                setEventData({ ...eventData, startDate: newDate })
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DateTimePicker
                            label="End Date"
                            value={endDate}
                            onChange={newDate => {
                                setEventData({ ...eventData, endDate: newDate })
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
                <Button
                    variant="contained"
                    color="success"
                    onClick={editEvent}
                    disabled={!title}>
                    Done
                </Button>
            </form>
        </Box>
    )
}

export default EditSharedEventForm;