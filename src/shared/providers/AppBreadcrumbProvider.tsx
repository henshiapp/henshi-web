import { useState } from "react";
import { BreadcrumbItem, AppBreadcrumbContext } from "../contexts/AppBreadcrumbContext";


export const AppBreadcrumbProvider = ({ children }: { children: React.ReactNode; }) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);

  return (
    <AppBreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </AppBreadcrumbContext.Provider>
  );
};
