import { Navigate } from "react-router";
import useUser from '../hooks/useUser';

export const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user?.accessToken) {
    return <Navigate to='/login' />
  }

  return children;
}

export default ProtectedRoute