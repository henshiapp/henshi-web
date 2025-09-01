import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../../shared/hooks/useAuth";

const Login = () => {
  const { isLoading, isAuthenticated, login, register } = useAuth();

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isAuthenticated === false && (
        <>
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