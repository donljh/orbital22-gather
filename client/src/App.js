import React from 'react';
import { Routes, Route } from 'react-router-dom';

import useUser from './hooks/useUser';

import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

export const UserContext = React.createContext([]);


function App() {
  // const navigate = useNavigate();
  const { user } = useUser();
  console.log(user);

  return (  
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected routes */}
        <Route path='dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
