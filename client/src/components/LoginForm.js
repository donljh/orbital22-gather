import React, { useState, useContext } from 'react';
import { Link, navigate } from '@reach/router';
import { UserContext } from '../App';

/**
 * LoginForm is the component that facilitates the login of new users
 * 
 * The component accepts fields that represent user credentials and hits the
 * login API on the server backend for authentication.
 * 
 * Upon successful login, the user is directed to the application's dashboard
 * 
 * Upon unsuccessful login, an error is displayed to notify the user to amend
 * their entered credentials
 */
const LoginForm = () => {
  const [user, setUser] = useContext(UserContext);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    fetch('http://localhost:4000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          password
      })
    })
    .then(response => {
      if (response.ok) handleSuccessfulLogin(response);
      else if (!response.ok) handleUnsuccessfulLogin(response);
    })
  }

  const handleUnsuccessfulLogin = async (response) => {
    try {
      response = await response.json();
      setError(response.message);
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleSuccessfulLogin = async (response) => {     
    try {
      response = await response.json();
      setUser({
        accessToken: response.accessToken
      })
      console.log(user.accessToken);
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  }  

  const handleChange = e => {
    if (e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  }

  return (
    <div className='login-wrapper'>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p style={{color: 'red'}}>{ error ? '* ' + error : ''}</p>
        <div className='login-input'>
          <input
              value={email}
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Email'
              autoComplete='on'
              required={true}
          />
          <input
              value={password}
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Password'
              required={true}
          />
          <button type='submit'>Login</button>
        </div>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link> here.</p>
    </div>
  )
}

export default LoginForm;