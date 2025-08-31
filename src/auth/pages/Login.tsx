import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../../shared/hooks/useAuth";
import { auth0Config } from "../config/auth0-config";

const Login = () => {
  const { isLoading, isAuthenticated, login, register } = useAuth();

  const config = JSON.stringify(auth0Config);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isAuthenticated === false && (
        <>
          Config: {config}
          <div>
            <Button
              onClick={() => login()}
            >
              Login
            </Button>
          </div>
          <div>
            <Button
              onClick={() => register()}
            >
              Register
            </Button>
          </div>
        </>
      )}
      {isAuthenticated && <Navigate to="/app/dashboard" />}
    </div>
  );
};

export default Login;