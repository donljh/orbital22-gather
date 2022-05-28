import { Link } from '@reach/router';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App'

/**
 * Protected is the component that represents sample protected user data
 * 
 * Protected sample data is rendered when the requesting user is successfully
 * authenticated when hitting the protected API on the server backend.
 * 
 * This is a dummy component that will be replaced in future iterations of the
 * development.
 */
const Protected = () => {
  const [user] = useContext(UserContext);
  const [content, setContent] = useState('You need to login');

  useEffect(() => {
    async function fetchProtected() {
      const result = await (await fetch('http://localhost:4000/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${user.accessToken}`,
        }
      })).json();
      if (result.data) setContent(result.data.toUpperCase());
    }
    fetchProtected();
  }, [user])

  return (
    <div className="protected">
      <h1>Currently Accessing Protected Data:</h1>
      <h2>{content}</h2>
      <Link to="/" className="protected"><button>Go back to dashboard</button></Link>
    </div>
  )
}

export default Protected;