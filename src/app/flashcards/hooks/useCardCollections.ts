import { Api } from "../../../auth/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { CardCollection } from "../types/CardCollection";

export type ListCardCollectionsResponse = ApiResponse<CardCollection[]>;

export const useCardCollections = (page: number, pageSize: number, search: string) => {
  return useQuery({
    queryKey: ["cardCollections", page, pageSize, search],
    queryFn: () => Api.get<ListCardCollectionsResponse>(
      "/v1/card-collections",
      new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      }),
    ),
  });
}; 

