import { Router } from "@reach/router";
import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistrationForm";

/**
 * Landing Page is the component displayed when a user has yet to successfully
 * log in/register.
 * 
 * Two paths are routed:
 * LoginForm --> To facilitate login of a user with entered credentials
 * RegisterForm --> To faciliate registration of a user with entered credentials
 */
function LandingPage() {
  return (
    <div className="landing-page">
      <Router>
        <LoginForm path="/" />
        <RegisterForm path="/register"/>
      </Router>
    </div>
  )
}

export default LandingPage;