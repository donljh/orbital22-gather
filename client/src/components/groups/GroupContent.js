import { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider';

import useAxiosRes from '../../hooks/useAxiosRes';
import GroupDetail from './GroupDetail';

const GroupContent = (props) => {
  const [group, setGroup] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { isGroupListModified, setIsGroupListModified, setSelectedGroupID } = props;

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
      <GroupDetail 
        groupID={groupID} group={group} isUserAdmin={isUserAdmin} 
        isGroupListModified={isGroupListModified} 
        setIsGroupListModified={setIsGroupListModified} 
        setSelectedGroupID={setSelectedGroupID} />
    </>)
  )
}

export default GroupContent