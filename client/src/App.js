import React, { useState, useEffect } from 'react';
import { Router, navigate } from '@reach/router';

import Content from './components/Content';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Protected from './components/Protected';
import Register from './components/Register';

export const UserContext = React.createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logoutCallback = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    // Clear user from context
    setUser({});
    navigate('/');
  }

  // Get new accessToken if a refreshToken exists
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json();
      setUser({
        accessToken: result.accessToken
      }); 
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logoutCallback={logoutCallback} />
        <Router>
          <Login path="login" />
          <Register path="register" />
          <Protected path="protected" />
          <Content path="/" />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
