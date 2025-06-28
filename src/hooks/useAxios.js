import axios from 'axios'; 
import { useEffect } from 'react'; 
import { api } from '../api';
import { useAuth } from './useAuth';
 
export const useAxios = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        const token = auth?.authToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          auth?.refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh-token`,
              {
                refreshToken: auth.refreshToken,
              }
            );
            const { accessToken, refreshToken, user } = res.data;

            const updatedAuth = {
              ...auth,
              authToken: accessToken,
              refreshToken,
              user,
            };

            setAuth(updatedAuth);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth]);

  return { api };
};
