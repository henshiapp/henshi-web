import { createZitadelAuth, ZitadelConfig } from "@zitadel/react";
import { User } from "oidc-client-ts";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const config: ZitadelConfig = {
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
    redirect_uri: "http://localhost/app/dashboard",
  };

  const zitadel = createZitadelAuth(config);

  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, [zitadel]);

  useEffect(() => {
    if (isAuthenticated === null) {
      zitadel.userManager
        .signinRedirectCallback()
        .then((user: User) => {
          if (user) {
            setIsAuthenticated(true);
            setUser(user);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
    if (isAuthenticated === true && user === null) {
      zitadel.userManager
        .getUser()
        .then((user) => {
          if (user) {
            setIsAuthenticated(true);
            setUser(user);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, [isAuthenticated, zitadel.userManager, setIsAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
