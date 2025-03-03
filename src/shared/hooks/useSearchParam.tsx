import { useSearchParams } from "react-router-dom";

export const useSearchParam = () => {
  const [searchParams] = useSearchParams();

  return searchParams.get("search") ?? "";
};
