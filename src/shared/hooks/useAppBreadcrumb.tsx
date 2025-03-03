import { useContext } from "react";
import { AppBreadcrumbContext } from "../contexts/AppBreadcrumbContext";


export const useAppBreadcrumb = () => {
  const context = useContext(AppBreadcrumbContext);
  if (!context) {
    throw new Error("useAppBreadcrumb must be used within a AppBreadcrumbProvider");
  }
  return context;
};
