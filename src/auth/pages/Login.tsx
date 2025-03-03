import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../../shared/hooks/useAuth";

const Login = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <div>
      {isAuthenticated === null && <div>Loading...</div>}
      {isAuthenticated === false && (
        <div>
          <Button
            onClick={() => login()}
          >
            Login
          </Button>
        </div>
      )}
      {isAuthenticated && <Navigate to="/app/dashboard" />}
    </div>
  );
};

export default Login;