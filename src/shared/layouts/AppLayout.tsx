import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { AppBreadcrumb } from "../components/AppBreadcrumb";
import { AppTopbar } from "../components/AppTopbar";

export const AppLayout = () => {
  return (
    <div className="flex bg-slate-950">
      <AppSidebar />
      <div className="flex flex-col w-full h-screen">
        <AppTopbar />
        <div className="p-5 m-2 rounded-lg bg-slate-900 border-slate-700 border-1 shadow-lg h-11/12">
          <AppBreadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
