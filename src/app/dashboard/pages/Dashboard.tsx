import { useEffect } from "react";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppBreadcrumb } from "../../../shared/hooks/useAppBreadcrumb";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  const { setPageTitle } = usePageTitle()
  const { setBreadcrumb } = useAppBreadcrumb()

  useEffect(() => {
    setPageTitle('Dashboard')
    setBreadcrumb([])
  }, [])

  if (isAuthenticated === true && user) {
    return (
      <div>
        Dashboard
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Dashboard;