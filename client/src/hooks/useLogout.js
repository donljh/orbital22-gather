import { axiosAuth } from "../api/axios";
import { useNavigate } from "react-router-dom";
import useUser from "./useUser";

const useLogout = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const logout = async () => {
    await axiosAuth.post('/logout');
    setUser({});
    navigate('/login');
  }

  return logout
}

export default useLogout;