import { axiosResource } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useUser from "./useUser";

const useAxiosResource = () => {
  const refresh = useRefreshToken();
  const { user } = useUser();

  useEffect(() => {
    const requestIntercept = axiosResource.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${user.accessToken}`
        }
        return config;
      }, (error) => Promise.reject(error)
    );

    const responseIntercept = axiosResource.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosResource(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosResource.interceptors.request.eject(requestIntercept);
      axiosResource.interceptors.response.eject(responseIntercept);
    }
  }, [user, refresh])


  return axiosResource;
}

export default useAxiosResource;