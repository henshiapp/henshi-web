import { Api } from "../../../auth/hooks/useApi"
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Flashcard } from "../types/Flashcard";

export const useFlashcards = (collectionId: string, page: number, pageSize: number, search: string) => {
    return useQuery({
        queryKey: ['flashcards', collectionId, page, pageSize, search],
        queryFn: async () => await
            Api.get<ListFlashcardsResponse>(
                `/v1/card-collections/${collectionId}/flashcards`,
                new URLSearchParams({
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                    search,
                }),
            )
    })
}
export type ListFlashcardsResponse = ApiResponse<Flashcard[]>;
