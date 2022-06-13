import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import useAxiosRes from '../../hooks/useAxiosRes';

const GroupInvitations = () => {

  const [invitations, setInvitations] = useState([]); 
  const axiosRes = useAxiosRes();

  useEffect(() => {
    console.log(invitations)
    axiosRes.get('/invitation')
      .then(response => setInvitations(response.data))
      .catch(console.log)
  }, [axiosRes])

  return (
    <Stack
    mt={3}
    spacing={3}
    px={2}>
      { invitations.map(invitation => (
      <Card sx={{ background: "#282828" }}>
      <CardContent>
        <Typography variant="h6" color="white">Invited To <Typography variant="h6" color="orange">{invitation.group.name}</Typography></Typography>
        <Typography variant="h6" color="white"> Invited By <Typography variant="h6" color="orange">{invitation.invited_by.profile.name}</Typography></Typography>
        <Typography variant="h6" color="#676767">{invitation.invited_by.email}</Typography>
      </CardContent>
    </Card>))
    }
  </Stack>
  )
}

export default GroupInvitations