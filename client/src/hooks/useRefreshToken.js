import { axiosAuth } from '../api/axios'
import useUser from './useUser';

const useRefreshToken = () => {
  const { setUser } = useUser();

  const refresh = async () => {
    const response = await axiosAuth.get('/refresh_token', {
      withCredentials: true
    });
    setUser(prev => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken}
    })
    return response.data.accessToken;
  }
  
  return refresh;
}

export default useRefreshToken