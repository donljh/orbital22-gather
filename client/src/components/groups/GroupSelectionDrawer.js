import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MailIcon from '@mui/icons-material/Mail';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CreateNewGroupModal from './CreateNewGroupModal';

import useAxiosRes from '../../hooks/useAxiosRes';

const GroupSelectionDrawer = (props) => {
  const { 
    selectedGroupID, 
    setSelectedGroupID, 
    isGroupListModified, 
    setIsGroupListModified } = props;

  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const openCreateNewGroupModal = () => setOpen(true);
  const closeCreateNewGroupModal = () => setOpen(false);

  const handleGroupSelection = e => {
    setSelectedGroupID(e.target.value);
  }

  const axiosRes = useAxiosRes();

  useEffect(() => {
    setIsGroupListModified(false)
    axiosRes.get('/group')
      .then(response => {
        setGroups(response.data)
      })
      .catch(err => console.log(err))
  }, [axiosRes, isGroupListModified, setIsGroupListModified])

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
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h4" color="#ffffff" 
          fontWeight='semi-bold' textAlign="center" 
          gutterBottom>Your Groups</Typography>
        <Divider color="#e2e2e2"/>
        <Stack direction="column" spacing={2} mt={2}>
          <Button 
            sx={{ borderRadius: '20px' }} startIcon={<AddOutlinedIcon />} 
            color='success' variant='contained'
            onClick={openCreateNewGroupModal}>
            New Group
          </Button>   
          <Button
            sx={{ borderRadius: '20px' }} startIcon={<MailIcon />} 
            variant='contained'
            onClick={() => setSelectedGroupID(null)}>
            Invitations
          </Button>
          <Divider color="#e2e2e2" />
          {groups.map(group => 
            <Button
              sx={{ 
                overflow: 'hidden',
                borderRadius:'20px', 
                background: (selectedGroupID === group._id) ? '' : '#282828'
              }}
              key={group._id}
              value={group._id}
              onClick={handleGroupSelection} 
              variant="contained" 
              color="warning">
              {group.name}</Button>)
          }
        </Stack>
      </Box>
    </Drawer>

    <CreateNewGroupModal 
      open={open} onClose={closeCreateNewGroupModal} 
      setIsGroupListModified={setIsGroupListModified}/>
  </>
  )
}

export default GroupSelectionDrawer