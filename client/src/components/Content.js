import React, { useContext } from 'react';
import { Redirect } from '@reach/router';
import { UserContext } from '../App';

const Content = () => {
    const [user] = useContext(UserContext);
    if(!user.accessToken) return <Redirect from='' to='login' noThrow />
    return <div>This is content</div>
}

export default Content;