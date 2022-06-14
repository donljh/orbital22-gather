import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import useAxiosRes from '../../hooks/useAxiosRes';


const InvitationCard = (props) => {
  const { setIsInvitationResolved, setIsGroupListModified, invitation } = props;
  const invitationID = invitation._id;
  const groupID = invitation.group._id;

  const axiosRes = useAxiosRes();

  const resolveInvitation = () => {
    setIsInvitationResolved(true);
    setIsGroupListModified(true);
    axiosRes.delete(`/invitation/${invitationID}`)
      .then(() => console.log("invitation deleted"))
      .catch(console.log)
  }

  const acceptInvitation = () => {
    axiosRes.patch(`/group/${groupID}/join`)
      .then(resolveInvitation)
      .catch(console.log)
  }

  const rejectInvitation = () => resolveInvitation();


  return (
  <Card sx={{ background: "#282828" }}>
    <CardContent>
      <Typography variant="h6" color="white">Invited To: 
        <Typography variant="h5" color="orange" component="span">
          {invitation.group.name}
        </Typography>
      </Typography>
      
      <Typography variant="h6" color="white">Invited By: 
        <Typography variant="h5" color="orange" component="span">
          {invitation.invited_by.profile.name}
        </Typography>
        | 
        <Typography variant="h6" color="#676767" component="span">
          {invitation.invited_by.email}
        </Typography>
      </Typography>

      <Typography variant="subtitle1" color="#676767">
        {invitation.message}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="success" variant="contained" onClick={acceptInvitation}>Accept</Button>
      <Button color="error" variant="outlined" onClick={rejectInvitation}>Reject</Button>
    </CardActions>
  </Card>)
}

const GroupInvitations = (props) => {
  const [invitations, setInvitations] = useState([]);
  const [isInvitationResolved, setIsInvitationResolved] = useState(false);
  const { setIsGroupListModified } = props;

  const axiosRes = useAxiosRes();

  useEffect(() => {
    setIsInvitationResolved(false);
    axiosRes.get('/invitation')
      .then(response => setInvitations(response.data))
      .catch(console.log)
  }, [axiosRes, isInvitationResolved])

  return (
    <Stack
      mt={3}
      spacing={3}
      px={2}>
      { invitations.length === 0 
          ? <Typography variant="h6" color="white">You have no pending invitations</Typography>
          :  invitations.map(invitation => 
              <InvitationCard 
                invitation={invitation} 
                setIsInvitationResolved={setIsInvitationResolved}
                setIsGroupListModified={setIsGroupListModified} />)}
    </Stack>
  )
}

export default GroupInvitations