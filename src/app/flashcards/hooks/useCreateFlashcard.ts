import { useApi } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useCreateFlashcard = () => {
    const api = useApi()

    return useMutation({
        mutationKey: ['createFlashcard'],
        mutationFn: api.createFlashcard
    })
}