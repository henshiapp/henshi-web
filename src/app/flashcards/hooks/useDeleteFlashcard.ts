import { useApi } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useDeleteFlashcard = () => {
    const api = useApi()

    return useMutation({
        mutationKey: ['deleteFlashcard'],
        mutationFn: api.deleteFlashcard
    })
}