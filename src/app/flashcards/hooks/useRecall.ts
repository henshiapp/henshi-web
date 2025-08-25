import { Api } from "../../../auth/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Flashcard } from "../types/Flashcard";

export const useRecall = (collectionId?: string) => {
  return useQuery({
    queryKey: ["recall", collectionId],
    queryFn: async () => await
      Api.get<FetchRecallResponse>(
        `/v1/card-collections/${collectionId}/flashcards/recall`,
        null
      ),
    refetchOnMount: "always"
  });
}; export type FetchRecallResponse = ApiResponse<Flashcard[]>;

