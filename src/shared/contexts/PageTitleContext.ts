import { createContext } from "react";


export const PageTitleContext = createContext<{
  pageTitle: string;
  setPageTitle: (title: string) => void;
} | null>(null);
