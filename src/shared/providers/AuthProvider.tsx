import React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth0 = useAuth0()

  const login = () => {
    auth0.loginWithRedirect();
  }

  const register = () => {
    auth0.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })
  }

  const logout = () => {
    auth0.logout()
  }

  return (
    <AuthContext.Provider value={{
      isLoading: auth0.isLoading,
      isAuthenticated: auth0.isAuthenticated,
      user: auth0.user,
      login,
      register,
      logout,
      getAccessToken: auth0.getAccessTokenSilently
    }}>
      {children}
    </AuthContext.Provider>
  );
};
