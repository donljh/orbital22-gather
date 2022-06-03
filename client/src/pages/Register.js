import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axios';
import useUser from '../hooks/useUser';

/**
 * Register is the page that contains the registration form faciliating 
 * registration of new users
 * 
 * The form accepts fields that represent user credentials and hits the
 * registration API on the server backend with the given credentials
 * 
 * Upon successful registration, the user is directed to the dashboard
 * 
 * Upon unsuccessful registration, an error is displayed to notify the user to 
 * amend their entered credentials
 */
const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = credentials;


  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const config = { headers: { 'Content-Type': 'application/json' }};
    axiosAuth.post('/register', credentials, config)
    .then(response => {
      setUser({ accessToken: response.data.accessToken })
      navigate('/');
    })
    .catch(error => {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    })
  }

  return(
      <div className='login-wrapper'>
          <form onSubmit={handleSubmit}>
              <h2>Register</h2>
              <p style={{color: 'red'}}>{ error ? '* ' + error : ''}</p>
              <div className='login-input'>
                  <input
                      value={name}
                      onChange={onChange}
                      type='text'
                      name='name'
                      placeholder='Name'
                      required={true}
                  />
                  <input
                      value={email}
                      onChange={onChange}
                      type='email'
                      name='email'
                      placeholder='Email'
                      autoComplete='email'
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
                  <button type='submit'>Register</button>
              </div>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link> here</p>
      </div>
  )
}

export default Register;