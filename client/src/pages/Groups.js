
import { useState } from 'react';
import Box from '@mui/material/Box';

import GroupSelectionDrawer from '../components/groups/GroupSelectionDrawer';
import GroupContent from '../components/groups/GroupContent';
import GroupInvitations from '../components/groups/GroupInvitations'

const Groups = () => {
  const [selectedGroupID, setSelectedGroupID] = useState(null);

  const [isGroupListModified, setIsGroupListModified] = useState(false);

  return (<>
    <Box sx={{display: 'flex'}}>
      <GroupSelectionDrawer 
        selectedGroupID={selectedGroupID} 
        setSelectedGroupID={setSelectedGroupID}
        isGroupListModified={isGroupListModified}
        setIsGroupListModified={setIsGroupListModified}
        />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        { selectedGroupID 
            ? <GroupContent 
                groupID={selectedGroupID} 
                setSelectedGroupID={setSelectedGroupID} 
                setIsGroupListModified={setIsGroupListModified} />
            : <GroupInvitations 
                setIsGroupListModified={setIsGroupListModified} />}
      </Box>
    </Box>
    </>
  )
}

export default Groups;