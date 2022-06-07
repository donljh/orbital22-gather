import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useAxiosRes from '../hooks/useAxiosRes';

/**
 * Dashboard is the main display page of the web application when a user
 * is successfully logged in/registered.
 */
function Dashboard() {
  const axiosRes = useAxiosRes();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axiosRes.get('/profile').then(response => {
      setProfile(response.data)
    })   
  }, [axiosRes])
  
  return (
    <div className="dashboard">
      <h1>Welcome, {profile.name}.</h1>
      <h2>Gather Dashboard, Coming Soon.</h2>
      <Link className="protected" to="protected"><button>Click for sample protected data</button></Link>
    </div>
  )
}

export default Dashboard;