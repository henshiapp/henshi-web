import { useApi } from "../../../auth/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export const useRecall = (collectionId?: string) => {
  const api = useApi();

  return useQuery({
    queryKey: ["recall", collectionId],
    queryFn: async () => await api.recall(collectionId),
    refetchOnMount: "always"
  });
};
