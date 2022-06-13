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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CreateNewGroupModal from './CreateNewGroupModal';

import useAxiosRes from '../../hooks/useAxiosRes';
import GroupDetail from './GroupDetail';

const GroupContent = (props) => {
  const [group, setGroup] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const { groupID } = props;

  const axiosRes = useAxiosRes();

  useEffect(() => {
    axiosRes.get(`/group/${groupID}`)
      .then(response => {
        setGroup(response.data.group)
        setIsUserAdmin(response.data.isUserAdmin)
      })
      .catch(console.log);
  }, [axiosRes, groupID])

  return (
    (group &&
    <>
      <Stack 
        mb={2}
        spacing={2}  
        direction='row' 
        justifyContent='center' 
        >
        {
          ['details', 'calendar', 'tasks'].map(category => 
            <Button 
              key={category}
              sx={{ borderRadius: '20px', background: (category === 'details') ? '' : '#282828' }}
              color="warning"
              variant='contained'
              value={category}>
              {category}
            </Button>)
        }
      </Stack>
      <Divider color={'#e2e2e2'}/>
      <GroupDetail groupID={groupID} group={group} isUserAdmin={isUserAdmin} />
    </>)
  )
}

export default GroupContent