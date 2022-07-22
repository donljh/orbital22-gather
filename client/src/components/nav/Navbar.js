import React, { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "../../assets/gather-icon.png";

import useLogout from "../../hooks/useLogout";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const links = [
  { name: "dashboard", icon: <DashboardOutlinedIcon />, to: "" },
  { name: "calendar", icon: <CalendarMonthOutlinedIcon />, to: "calendar" },
  { name: "task manager", icon: <AssignmentOutlinedIcon />, to: "taskmanager" },
  { name: "groups", icon: <GroupsOutlinedIcon />, to: "groups" },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const logout = useLogout();

  const handleProfileLinkClick = (e) => {
    navigate("/profile");
    closeProfileMenu();
  };

  const openProfileMenu = (e) => {
    setAnchorEl(e.target);
  };

  const closeProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          backgroundColor: "#282828",
        }}
      >
        <Avatar alt="Gather Logo" src={Logo} />
        <Stack direction="row" spacing={2}>
          {links.map(({ name, icon, to }) => (
            <Button
              color="warning"
              variant="contained"
              key={name}
              startIcon={icon}
              onClick={() => navigate(`${to}`)}
              sx={{ background: "#282828" }}
              size="medium"
            >
              {name}
            </Button>
          ))}
        </Stack>
        <IconButton size="large" onClick={openProfileMenu} color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
      <Menu open={open} onClose={closeProfileMenu} anchorEl={anchorEl}>
        <MenuItem onClick={handleProfileLinkClick}>My Profile</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
