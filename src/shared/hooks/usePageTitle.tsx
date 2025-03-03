import { useContext } from "react";
import { PageTitleContext } from "../contexts/PageTitleContext";

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitle must be used within a PageTitleProvider");
  }
  return context;
};
