import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axios';
import useUser from '../hooks/useUser';

/**
 * Login is the component that facilitates the login of new users
 * 
 * The component accepts fields that represent user credentials and hits the
 * login API on the server backend for authentication.
 * 
 * Upon successful login, the user is directed to the application's dashboard
 * 
 * Upon unsuccessful login, an error is displayed to notify the user to amend
 * their entered credentials
 */
const Login = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const credentials = { email, password };
    const config = {
      headers: { 'Content-Type': 'application/json' }    
    }
    axiosAuth.post('/login', credentials, config)
    .then(response => {
      setUser({ accessToken: response.data.accessToken });
      navigate('/dashboard')
    })
    .catch(error => {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    });
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

export default Login;