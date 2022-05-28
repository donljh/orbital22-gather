import { Link } from "@reach/router";
import React from "react";

/**
 * Dashboard is the main display/home page of the web application when a user
 * is successfully logged in.
 */
function Dashboard(props) {
  // Passed down user profile
  const profile = props.profile;

  return (
    <div className="dashboard">
      <h1>Welcome, {profile.name}.</h1>
      <h2>Gather Dashboard, Coming Soon.</h2>
      <Link className="protected" to="protected"><button>Click for sample protected data</button></Link>
    </div>
  )
}

export default Dashboard;