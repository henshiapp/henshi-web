import { useSearchParams } from "react-router-dom";

export const usePageSizeParam = (defaultValue: number = 10) => {
  const [searchParams] = useSearchParams();

  return searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : defaultValue;
};
