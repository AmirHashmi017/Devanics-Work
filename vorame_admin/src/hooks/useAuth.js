import { createContext, useContext, useEffect, useState } from "react";

import LocalStorage from "../managers/auth";
import AuthApi from "../services/api/auth";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = LocalStorage.getUser();
    const storedToken = LocalStorage.getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  //   Login user
  const login = async (credentials) => {
    const response = await AuthApi.login(credentials);

    if (response?.statusCode === 200) {
      setUser(response?.data?.user);
      setIsLoggedIn(true);
      LocalStorage.setUser(response?.data?.user);
      LocalStorage.setToken(response?.token);
    }

    return { response };
  };

  //   Logout user
  const logOut = async () => {
    LocalStorage.removeUser();
    LocalStorage.removeToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  const signout = () => {
    logOut();
  };

  return {
    user,
    login,
    signout,
    isLoggedIn,
  };
}
