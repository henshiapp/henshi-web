import { Api } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useCreateFlashcard = () => {
    return useMutation({
        mutationKey: ['createFlashcard'],
        mutationFn: (body: any) =>
            Api.post<any, null>(
                `/v1/card-collections/${body.collectionId}/flashcards`,
                body,
            )
    })
}