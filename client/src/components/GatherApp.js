import { Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Dashboard from "./Dashboard";
import Protected from "./Protected";
import { axiosAuth } from "../api/axios";
import useUser from "../hooks/useUser";

/**
 * GatherApp is the main encompassing component that other protected components
 * reside in. 
 * 
 * All other major sub components will reside in this component as a routed 
 * component.
 */
function GatherApp(props) {
  // Represents profile of current user
  const [profile, setProfile] = useState({});

  const navigate = useNavigate();
  const { setUser } = useUser();

  const logout = async () => {
    await axiosAuth.post('/logout');
    // Clear user from context
    setUser({});
    // navigate('/login');
  }

  useEffect(() => {
    async function fetchProfile() {
      const response = await (await fetch('http://localhost:5000/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${props.user.accessToken}`,
        }
      })).json();
      setProfile(response);
    }
    fetchProfile();
  }, [props.user]);

  return (
    <div>
      <Routes>
        <Dashboard path="/" profile={profile}></Dashboard>
        <Protected path="protected"></Protected>
      </Routes>
      <button className="logout" onClick={props.logoutCallback}>Logout</button>
    </div>
  )
}

export default GatherApp;