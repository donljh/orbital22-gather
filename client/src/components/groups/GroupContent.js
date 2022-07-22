import { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider';

import useAxiosRes from '../../hooks/useAxiosRes';
import GroupDetail from './GroupDetail';
import GroupTaskManager from './sharedtasks/GroupTaskManager';
import GroupCalendar from './sharedcalendar/GroupCalendar';

const GroupContent = (props) => {
  const [group, setGroup] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [selectedContent, setSelectedContent] = useState('details');
  const { isGroupListModified, setIsGroupListModified, setSelectedGroupID } = props;

  const [announcementsModified, setAnnouncementsModified] = useState(false);

  const { groupID } = props;

  const axiosRes = useAxiosRes();

  const setContentCategory = e => {
    setSelectedContent(e.target.value)
  }

  useEffect(() => {
    axiosRes.get(`/group/${groupID}`)
      .then(response => {
        setAnnouncementsModified(false);
        setGroup(response.data.group)
        setIsUserAdmin(response.data.isUserAdmin)
      })
      .catch(console.log);
  }, [axiosRes, groupID, announcementsModified])

  let SelectedContentComponent = <></>;
  if (selectedContent === 'details') {
    SelectedContentComponent = <GroupDetail
      groupID={groupID} group={group} isUserAdmin={isUserAdmin} 
      setAnnouncementsModified = {setAnnouncementsModified}
      isGroupListModified={isGroupListModified} 
      setIsGroupListModified={setIsGroupListModified} 
      setSelectedGroupID={setSelectedGroupID} />
  } else if (selectedContent === 'calendar') {
    SelectedContentComponent = <GroupCalendar groupID={groupID}/>
  } else if (selectedContent === 'tasks') {
    SelectedContentComponent = <GroupTaskManager groupID={groupID}/>
  }

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
          ['details', 'calendar', 'tasks'].map(contentCategory => 
            <Button 
              key={contentCategory}
              sx={{ borderRadius: '20px', background: (contentCategory === selectedContent) ? '' : '#282828' }}
              color="warning"
              variant='contained'
              value={contentCategory}
              onClick={setContentCategory}>
              {contentCategory}
            </Button>)
        }
      </Stack>
      <Divider color={'#e2e2e2'}/>
      {SelectedContentComponent}

    </>)
  )
}

export default GroupContent