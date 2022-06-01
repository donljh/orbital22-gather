import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { axiosAuth } from '../api/axios';

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
  const { user } = useUser();
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchProtected() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        }
      }
      axiosAuth.post('/protected', [], config
      ).then(res => setContent(res.data.data))
    }
    fetchProtected();
  }, [user, setContent])

  return (
    <div className="protected">
      <h1>Currently Accessing Protected Data:</h1>
      <h2>{content}</h2>
      <Link to="/" className="protected"><button>Go back to dashboard</button></Link>
    </div>
  )
}

export default Protected;