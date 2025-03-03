import { useApi } from "../../../auth/hooks/useApi"
import { useQuery } from "@tanstack/react-query";

export const useFlashcards = (collectionId: string, page: number, pageSize: number, search: string) => {
    const api = useApi()

    return useQuery({
        queryKey: ['flashcards', collectionId, page, pageSize, search],
        queryFn: async () => await api.fetchFlashcards(collectionId, page, pageSize, search)
    })
}