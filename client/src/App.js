import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import LandingPage from './components/LandingPage';
import GatherApp from './components/GatherApp';

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
      const response = await (await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json();
      setUser({
        accessToken: response.accessToken, 
      }); 
      setLoading(false);
    }
    checkRefreshToken();
    }, [])

  if (loading) return <div>Loading...</div>

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className='app'>      
        { /* Grant access to the application if accesstoken exists, else
             redirect to login page */
          user.accessToken 
          ? <GatherApp 
            path="/dashboard" 
            user={user} 
            logoutCallback={logoutCallback}/>
          : <LandingPage path="/login" />
        }
      </div>
    </UserContext.Provider>
  );
}

export default App;
