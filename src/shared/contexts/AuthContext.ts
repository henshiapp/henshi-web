import { createContext } from "react";
import { User } from "@auth0/auth0-react";

export const AuthContext = createContext<{
    isLoading: boolean | null;
    isAuthenticated: boolean | null;
    user?: User;
    getAccessToken: (options?: any) => Promise<string>;
    login: VoidFunction;
    register: VoidFunction;
    logout: VoidFunction;
} | null>(null);
