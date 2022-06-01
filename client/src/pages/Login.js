import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axios';
import useUser from '../hooks/useUser';

/**
 * Login is the page component that contains the login form faciliating 
 * login of  users
 * 
 * The form accepts fields that represent user credentials and hits the
 * login API on the server backend with the given credentials
 * 
 * Upon successful login, the user is directed to the dashboard
 * 
 * Upon unsuccessful login, an error is displayed to notify the user to 
 * amend their entered credentials
 */
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  const { email, password } = credentials;

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const config = {
      headers: { 'Content-Type': 'application/json' },    
      withCredentials: true
    }
    axiosAuth.post('/login', credentials, config)
    .then(response => {
      setUser({ accessToken: response.data.accessToken });
      navigate('/')
    })
    .catch(error => {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    });
  }

  return (
    <div className='login-wrapper'>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p style={{color: 'red'}}>{ error ? '* ' + error : ''}</p>
        <div className='login-input'>
          <input
              value={email}
              onChange={onChange}
              type='email'
              name='email'
              placeholder='Email'
              autoComplete='on'
              required={true}
          />
          <input
              value={password}
              onChange={onChange}
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