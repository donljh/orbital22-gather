import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useUser from "../hooks/useUser";

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
  }, []);

  return (
    <>
      {loading 
          ? <p>Loading</p>
          : <Outlet />
      }
    </>
  )
}

export default PersistentLogin