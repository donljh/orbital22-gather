import { useContext, useDebugValue } from "react";
import UserContext from "../context/UserProvider";

const useUser = () => {
    const { user } = useContext(UserContext);
    useDebugValue(user, user => user?.accessToken ? "Logged In" : "Logged Out")
    return useContext(UserContext);
}

export default useUser;