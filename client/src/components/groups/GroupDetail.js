import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import CreateNewInvitationModal from './CreateNewInvitationModal'

const GroupDetail = (props) => {
  const { name, members, admins } = props.group;
  const { isUserAdmin, groupID } = props;

  const [open, setOpen] = useState(false);

  const openCreateNewInvitationModal = () => setOpen(true);
  const closeCreateNewInvitationModal = () => setOpen(false);

  return (
    <Stack
    mt={3}
    spacing={3}
    px={2}
  >
    <Card sx={{ background: "#282828" }}>
      <CardContent>
        <Typography variant="h6" color="lightgrey">
          Group Name
        </Typography>
        <Typography variant="h3" color="white">
          {name}
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ background: "#282828" }}>
      <CardContent>
        <Typography variant="h6" color="lightgrey" gutterBottom>
          Admins
        </Typography>
        <Grid container spacing={2} width={'100%'}>
          {admins.map(admin => (
            <Grid key={admin._id} item xs={12} md={4}>
              <Card sx={{ background: "#505050" }}>
                <CardContent>
                  <Typography variant="h6" color="white">{admin.profile.name}</Typography>
                  <Typography variant="subtitles" color="#e2e2e2">{admin.email}</Typography>
                </CardContent>
              </Card>
            </Grid>)
          )}
        </Grid>     
      </CardContent>
    </Card>
    <Card sx={{ background: "#282828" }}>
      <CardContent>
        <Stack direction="row" spacing={3} mb={1}>
          <Typography variant="h6" color="lightgrey" gutterBottom>Members</Typography>
          <Button size="small" color="success" 
          variant="contained" sx={{ borderRadius: '20px' }}
          onClick={openCreateNewInvitationModal}>Invite</Button>
        </Stack>
        <Grid container spacing={2} width={'100%'}>
          {members.map(member => (
            <Grid key={member._id} item xs={12} md={4}>
              <Card sx={{ background: "#505050" }}>
                <CardContent>
                  <Typography variant="h6" color="white">{member.profile.name}</Typography>
                  <Typography variant="subtitles" color="#e2e2e2">{member.email}</Typography>
                </CardContent>
              </Card>
            </Grid>)
          )}
        </Grid>        
      </CardContent>
    </Card>

    <CreateNewInvitationModal groupID={groupID} open={open} onClose={closeCreateNewInvitationModal}/>
  </Stack>
  )
}

export default GroupDetail