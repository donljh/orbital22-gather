import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useUser from "../hooks/useUser";
import useLogout from '../hooks/useLogout';

/**
 * PersistentLogin is a component that wraps around protected routes.
 * 
 * Its function is to ensure that the user is logged in persistently by
 * verifying and refreshing the user's tokens upon every render.
 */
const PersistentLogin = () => {
  const [loading, setLoading] = useState(true);

  const refresh = useRefreshToken();
  const { user } = useUser();
  const logout = useLogout();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      }
      catch (err) {
        console.log(err)
      }
      finally {
        setLoading(false);
      }
    }

    !user?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, [user.accessToken, refresh]);

  return (
    <>
      {loading 
          ? <p>Loading</p>
          : <><Outlet /><button onClick={logout}>Logout</button></>
      }
    </>
  )
}

export default PersistentLogin