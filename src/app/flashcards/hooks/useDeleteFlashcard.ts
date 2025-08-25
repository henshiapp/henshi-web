import { Api } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useDeleteFlashcard = () => {
    return useMutation({
        mutationKey: ['deleteFlashcard'],
        mutationFn: ({
            collectionId,
            id,
        }: {
            collectionId: string;
            id: string;
        }) =>
            Api.delete<null>(
                `/v1/card-collections/${collectionId}/flashcards/${id}`,
            )
    })
}