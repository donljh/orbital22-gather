import React, { useContext, useState } from 'react';
import { Link, navigate } from '@reach/router';
import { UserContext } from '../App';

/**
 * RegisterForm is the component that facilitates the registration of new users
 * 
 * The component accepts fields that represent user credentials and hits the
 * registration API on the server backend.
 * 
 * Upon successful registration, the user is directed to the application's dashboard
 * 
 * Upon unsuccessful registration, an error is displayed to notify the user to amend
 * their entered credentials
 */
const RegisterForm = () => {
  const [user, setUser] = useContext(UserContext);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name
      })
    })
    .then(response => {
      if (response.ok) handleSuccessfulRegistration(response);
      else if (!response.ok) handleUnsuccessfulRegistration(response);
    })
  }

  const handleUnsuccessfulRegistration = async (response) => {
    try {
      response = await response.json();
      setError(response.message);
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleSuccessfulRegistration = async (response) => {     
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
              <h3 style={{color: 'red'}}>{error}</h3>
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
          <p>Already have an account? <Link to="/">Login</Link> here</p>
      </div>
  )
}

export default RegisterForm;