import { createContext, useState } from "react";

const UserContext = createContext({});

/**
 * UserProvider wraps around the bulk of the application such that any children
 * components can access the current user data
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;