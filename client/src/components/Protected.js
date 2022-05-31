import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import useAxiosResource from '../hooks/useAxiosResource';
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
  const [content, setContent] = useState('You need to login');
  
  const axiosResource = useAxiosResource();


  useEffect(() => {
    async function fetchProtected() {
      axiosAuth.post('/protected').then(res => setContent(res.data.data))
    }
    fetchProtected();
  }, [user, axiosResource])

  return (
    <div className="protected">
      <h1>Currently Accessing Protected Data:</h1>
      <h2>{content}</h2>
      <Link to="/" className="protected"><button>Go back to dashboard</button></Link>
    </div>
  )
}

export default Protected;