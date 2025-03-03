import { useSearchParams } from "react-router-dom";

export const usePageParam = () => {
  const [searchParams] = useSearchParams();

  return searchParams.get("page") ? parseInt(searchParams.get("page")!) - 1 : 0;
};
