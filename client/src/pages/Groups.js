
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


import GroupSelectionDrawer from '../components/groups/GroupSelectionDrawer';
import GroupContent from '../components/groups/GroupContent';
import GroupInvitations from '../components/groups/GroupInvitations'

<Stack direction="column" spacing={2} mt={2}>
{
  [1,2,3,4].map(n => <Button variant="contained" color="warning" sx={{ borderRadius:'20px', background: (n === 1) ? '' : '#282828'}}>Group {n}</Button>)
}
</Stack>

const Groups = () => {
  const [selectedGroupID, setSelectedGroupID] = useState(null);

  return (<>
    <Box sx={{display: 'flex'}}>
      <GroupSelectionDrawer 
        selectedGroupID={selectedGroupID} 
        setSelectedGroupID={setSelectedGroupID}/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        { selectedGroupID 
            ? <GroupContent groupID={selectedGroupID} />
            : <GroupInvitations />}
      </Box>
    </Box>
    </>
  )
}

export default Groups;