import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PersistentLogin from './components/PersistentLogin';

import AppLayout from './components/layout/AppLayout';
import Main from './components/layout/Main';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import TaskManager from './pages/TaskManager';
import Groups from './pages/Groups'
import Profile from './pages/Profile'

export const UserContext = React.createContext([]);


function App() {

  return (  
    <Routes>
      <Route path="/" element={<AppLayout />}>

        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected routes */}
        <Route element={<PersistentLogin />}>
          <Route element={<Main />} >
            <Route path='' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path='calendar' element={<ProtectedRoute> <Calendar /> </ProtectedRoute>} />
            <Route path='taskmanager' element={<ProtectedRoute> <TaskManager /> </ProtectedRoute>} />
            <Route path='groups' element={<ProtectedRoute> <Groups /> </ProtectedRoute>} />
            <Route path='profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
