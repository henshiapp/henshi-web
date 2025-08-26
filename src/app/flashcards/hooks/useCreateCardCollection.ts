import { useMutation } from "@tanstack/react-query";
import { Api } from "../../../auth/hooks/useApi";

export const useCreateCardCollection = () => {
    return useMutation({
        mutationKey: ['createCardCollection'],
        mutationFn: (body: any) => Api.post<any, null>("/v1/card-collections", body)
    })
}