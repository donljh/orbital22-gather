import React from 'react';
import { useNavigate } from 'react-router';
import Logo from '../../assets/gather-icon.png';

import useLogout from '../../hooks/useLogout';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import { Button, Stack} from '@mui/material';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

const links =[['', <DashboardOutlinedIcon />],
              ['calendar', <CalendarMonthOutlinedIcon />],
              ['task manager', <AssignmentOutlinedIcon /> ],
              ['groups', <GroupsOutlinedIcon />]]

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLinkClick= e => {
    navigate(`/${e.target.value}`);
  }

  return(
    <AppBar position="sticky">
      <Toolbar sx={{ 
          justifyContent: 'space-between', 
          backgroundColor: '#282828' }}>
        <Avatar alt="Gather Logo" src={Logo} />
        <Stack direction="row">
          {links.map(link=> (
            <Button 
              color="warning"
              variant="contained"
              key={link[0]} 
              startIcon={link[1]}
              value={link[0].replace(" ","")} 
              onClick={handleLinkClick}
              sx={{ background:'#282828', mx: 2 }}
              size="medium"
            > 
            {link[0] || 'dashboard' } 
            </Button>))}
          </Stack>
        <Button onClick={logout} sx={{ color: 'white' }}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar