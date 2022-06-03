import { axiosAuth } from '../api/axios'
import useUser from './useUser';

/**
 * The useRefreshToken hook returns a function to grab and replace the current
 * access and refresh token from the backend server API.
 */
const useRefreshToken = () => {
  const { setUser } = useUser();

  const refresh = async () => {
    const response = await axiosAuth.post('/refresh_token', [], {
      withCredentials: true
    });
    setUser(prev => {
      return { ...prev, accessToken: response.data.accessToken}
    })
    return response.data.accessToken;
  }
  
  return refresh;
}

export default useRefreshToken