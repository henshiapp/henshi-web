import { Api } from "../../../auth/hooks/useApi"
import { useMutation } from "@tanstack/react-query";

export const useDeleteCardCollection = () => {
    return useMutation({
        mutationKey: ['deleteCardCollection'],
        mutationFn: (id: string) => Api.delete<null>(`/v1/card-collections/${id}`)
    })
}