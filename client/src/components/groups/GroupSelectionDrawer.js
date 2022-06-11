import React, { useState } from 'react';
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

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CreateNewGroupModal from './CreateNewGroupModal';

const GroupSelectionDrawer = () => {
  const [open, setOpen] = useState(false);

  const openCreateNewGroupModal = () => setOpen(true);
  const closeCreateNewGroupModal = () => setOpen(false);

  return (<>
    <Drawer 
      variant="permanent" 
      sx={{
        width: '250px', 
        [`& .MuiDrawer-paper`]: { 
          background:'none', 
          width: '250px', 
          boxSizing: 'border-box', 
          borderRight: '1px lightgrey solid' }}}>
      <Toolbar />
        <Box sx={{ overflow: 'hidden', p: 3 }}>
          <Typography variant="h4" fontWeight='semi-bold' color="#ffffff" textAlign="center" gutterBottom>Your Groups</Typography>
          <Divider color="#e2e2e2"/>
          <Stack direction="column" spacing={2} mt={2}>
            <Button 
              sx={{ borderRadius: '20px' }} startIcon={<AddOutlinedIcon />} 
              color='success' variant='contained'
              onClick={openCreateNewGroupModal}>
              New Group
            </Button>   
            <Divider color="#e2e2e2" />
            {
              [1,2,3,4].map(n => <Button variant="contained" color="warning" sx={{ borderRadius:'20px', background: (n === 1) ? '' : '#282828'}}>Group {n}</Button>)
            }
          </Stack>
        </Box>
    </Drawer>

    <CreateNewGroupModal open={open} onClose={closeCreateNewGroupModal}/>
  </>
  )
}

export default GroupSelectionDrawer