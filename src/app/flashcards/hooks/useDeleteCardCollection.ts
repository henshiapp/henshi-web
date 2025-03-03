import { useApi } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useDeleteCardCollection = () => {
    const api = useApi()

    return useMutation({
        mutationKey: ['deleteCardCollection'],
        mutationFn: api.deleteCardCollection
    })
}