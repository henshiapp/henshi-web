import { RecallResult } from "../../app/flashcards/pages/Recall";
import { CardCollection } from "../../app/flashcards/types/CardCollection";
import { Flashcard } from "../../app/flashcards/types/Flashcard";
import { useAuth } from "../../shared/hooks/useAuth";
import { ApiResponse } from "../../shared/types/ApiResponse";

export type ListCardCollectionsResponse = ApiResponse<CardCollection[]>;
export type ListFlashcardsResponse = ApiResponse<Flashcard[]>;
export type FetchRecallResponse = ApiResponse<Flashcard[]>;

export const useApi = () => {
  const { user } = useAuth();

  return {
    fetchCardCollections: (page: number, pageSize: number, search: string) =>
      Api.get<ListCardCollectionsResponse>(
        "/v1/card-collections",
        new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          search,
        }),
        user?.access_token
      ),
    createCardCollection: (body: any) =>
      Api.post<any, null>("/v1/card-collections", body, user?.access_token),
    deleteCardCollection: (id: string) =>
      Api.delete<null>(`/v1/card-collections/${id}`, user?.access_token),
    fetchFlashcards: (
      id: string,
      page: number,
      pageSize: number,
      search: string
    ) =>
      Api.get<ListFlashcardsResponse>(
        `/v1/card-collections/${id}/flashcards`,
        new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          search,
        }),
        user?.access_token
      ),
    createFlashcard: (body: any) =>
      Api.post<any, null>(
        `/v1/card-collections/${body.collectionId}/flashcards`,
        body,
        user?.access_token
      ),
    deleteFlashcard: ({
      collectionId,
      id,
    }: {
      collectionId: string;
      id: string;
    }) =>
      Api.delete<null>(
        `/v1/card-collections/${collectionId}/flashcards/${id}`,
        user?.access_token
      ),
    recall: (id?: string) =>
      Api.get<FetchRecallResponse>(
        `/v1/card-collections/${id}/flashcards/recall`,
        null,
        user?.access_token
      ),
    finishRecall: ({
      collectionId,
      ...body
    }: {
      collectionId: string;
      answers: RecallResult[];
    }) =>
      Api.post<any, null>(
        `/v1/card-collections/${collectionId}/flashcards/recall`,
        body,
        user?.access_token
      ),
  };
};

class Api {
  static API_BASE = import.meta.env.VITE_API_URL;

  static get<TRes>(
    path: string,
    params: URLSearchParams | null,
    accessToken?: string
  ) {
    return Api.fetchApi<any, TRes>("GET", path, params, null, accessToken);
  }

  static post<TReq = any, TRes = any>(
    path: string,
    body: TReq,
    accessToken?: string
  ) {
    return Api.fetchApi<TReq, TRes>("POST", path, null, body, accessToken);
  }

  static delete<TRes>(path: string, accessToken?: string) {
    return Api.fetchApi<any, TRes>("DELETE", path, null, null, accessToken);
  }

  static async fetchApi<TReq = any, TRes = any>(
    method: string,
    path: string,
    query: URLSearchParams | null,
    body: TReq,
    accessToken?: string
  ) {
    let url = Api.API_BASE + path;

    if (query?.size) {
      url += "?" + query;
    }

    const response = await fetch(url, {
      method,
      credentials: "include",
      body: method !== "GET" ? JSON.stringify(body) : null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return (await response.json()) as TRes;
  }
}
