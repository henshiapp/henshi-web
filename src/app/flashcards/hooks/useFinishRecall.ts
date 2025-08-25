import { Api } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";
import { RecallResult } from "../pages/Recall";

export const useFinishRecall = () => {
    return useMutation({
        mutationKey: ['finishRecall'],
        mutationFn: ({
            collectionId,
            ...body
        }: {
            collectionId: string;
            answers: RecallResult[];
        }) =>
            Api.post<any, null>(
                `/v1/card-collections/${collectionId}/flashcards/recall`,
                body
            ),
    })
}