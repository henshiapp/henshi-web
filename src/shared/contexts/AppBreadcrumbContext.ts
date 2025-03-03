import { createContext } from "react";

export type BreadcrumbItem = {
  label: string,
  path: string
}

export const AppBreadcrumbContext = createContext<{
  breadcrumb: BreadcrumbItem[];
  setBreadcrumb: (menu: BreadcrumbItem[]) => void;
} | null>(null);


