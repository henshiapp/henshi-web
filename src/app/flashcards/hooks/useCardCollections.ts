import { useApi } from "../../../auth/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export const useCardCollections = (page: number, pageSize: number, search: string) => {
  const api = useApi();

  return useQuery({
    queryKey: ["cardCollections", page, pageSize, search],
    queryFn: () => api.fetchCardCollections(page, pageSize, search),
  });
};
