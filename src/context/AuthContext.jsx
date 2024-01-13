import { createContext } from "react";
import React from "react";
import { useState } from "react";


export const AuthContext = createContext(null);

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState([]);

  return (
    <AuthContext.Provider value={{ user,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
