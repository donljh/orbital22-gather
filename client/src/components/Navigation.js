import React from 'react';
import { Link } from '@reach/router';

const Navigation = ({logoutCallback}) => (
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/protected">Protected</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><button onClick={logoutCallback}>Logout</button></li>
    </ul>
)

export default Navigation;