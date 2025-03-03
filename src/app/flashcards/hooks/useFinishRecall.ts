import { useApi } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useFinishRecall = () => {
    const api = useApi()

    return useMutation({
        mutationKey: ['finishRecall'],
        mutationFn: api.finishRecall
    })
}