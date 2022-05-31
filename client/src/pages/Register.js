import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axios';
import useUser from '../hooks/useUser';


/**
 * Register is the component that facilitates the registration of new users
 * 
 * The component accepts fields that represent user credentials and hits the
 * registration API on the server backend.
 * 
 * Upon successful registration, the user is directed to the application's dashboard
 * 
 * Upon unsuccessful registration, an error is displayed to notify the user to amend
 * their entered credentials
 */
const Register = () => {
  const navigate = useNavigate();

  const { setUser } = useUser();

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const credentials = { name, email, password }
    const config = { headers: { 'Content-Type': 'application/json' }};
    axiosAuth.post('/register', credentials, config)
    .then(response => {
      setUser({ accessToken: response.accessToken })
      navigate('/dashboard');
    })
    .catch(error => {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    })
  }

  const handleChange = e => {
      if (e.currentTarget.name === 'email') {
          setEmail(e.currentTarget.value);
      } else if (e.currentTarget.name === 'password') {
          setPassword(e.currentTarget.value);
      } else if (e.currentTarget.name === 'name') {
          setName(e.currentTarget.value);
      }
  }

  return(
      <div className='login-wrapper'>
          <form onSubmit={handleSubmit}>
              <h2>Register</h2>
              <p style={{color: 'red'}}>{ error ? '* ' + error : ''}</p>
              <div className='login-input'>
                  <input
                      value={name}
                      onChange={handleChange}
                      type='text'
                      name='name'
                      placeholder='Name'
                      required={true}
                  />
                  <input
                      value={email}
                      onChange={handleChange}
                      type='email'
                      name='email'
                      placeholder='Email'
                      autoComplete='email'
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
                  <button type='submit'>Register</button>
              </div>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link> here</p>
      </div>
  )
}

export default Register;