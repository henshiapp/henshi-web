import { useApi } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useCreateCardCollection = () => {
    const api = useApi()

    return useMutation({
        mutationKey: ['createCardCollection'],
        mutationFn: api.createCardCollection
    })
}