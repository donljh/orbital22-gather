import { axiosResource } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useUser from "./useUser";

/**
 * The useAxiosResource hook returns an axios instance that has added request
 * and reponse interceptors. The instance has its baseURL set as the resource
 * server.
 * 
 * The added request interceptor will add the authorization user access token
 * for every attempted request
 * 
 * The added response interceptor will grab a new access/refresh token if the
 * initial response is unauthorized (invalid token), and resends the request
 * with the new authorization tokens.
 */
const useAxiosRes = () => {
  const refresh = useRefreshToken();
  const { user } = useUser();

  useEffect(() => {
    const requestIntercept = axiosResource.interceptors.request.use(
      config => {
        // Add Authorization header with current user access token
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
        // Error detected in initial response, retry with new tokens
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

export default useAxiosRes;