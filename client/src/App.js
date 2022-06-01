import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PersistentLogin from './components/PersistentLogin';

import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Protected from './pages/Protected';

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
          <Route path='' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path='protected' element={<ProtectedRoute> <Protected /> </ProtectedRoute>} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
