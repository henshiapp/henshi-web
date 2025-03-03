import { User } from "oidc-client-ts";
import { createContext } from "react";

export const AuthContext = createContext<{ isAuthenticated: boolean | null; user: User | null; login: VoidFunction; signout: VoidFunction; } | null>(null);
