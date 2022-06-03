import { Navigate } from "react-router";
import useUser from '../hooks/useUser';

/**
 * ProtectedRoute is a component that wraps around components that are meant to
 * only be accessible upon login. 
 * 
 * Its function is to determine the user's authorization before deciding if 
 * the content of itschildren (protected routes) can be shared.
 */
export const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // No access token from the current user, redirect to login page
  if (!user?.accessToken) {
    return <Navigate to='/login' />
  }

  // Access token available, display protected route
  return children;
}

export default ProtectedRoute