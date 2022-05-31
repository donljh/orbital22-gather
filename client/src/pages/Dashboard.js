import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import useAxiosResource from '../hooks/useAxiosResource';

/**
 * Dashboard is the main display/home page of the web application when a user
 * is successfully logged in.
 */
function Dashboard() {
  // Passed down user profile
  const { user } = useUser();
  const axiosResource = useAxiosResource();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axiosResource.get('/profile').then(response => {
      console.log(response)
      setProfile(response.data)
    })   
  }, [user])
  

  return (
    <div className="dashboard">
      <h1>Welcome, {profile.name}.</h1>
      <h2>Gather Dashboard, Coming Soon.</h2>
      <Link className="protected" to="protected"><button>Click for sample protected data</button></Link>
    </div>
  )
}

export default Dashboard;