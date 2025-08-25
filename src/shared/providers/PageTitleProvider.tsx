import { useEffect, useState } from "react";
import { PageTitleContext } from "../contexts/PageTitleContext";

export const PageTitleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    document.title = pageTitle ? pageTitle + " | Henshi" : "Henshi";
  }, [pageTitle]);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};
