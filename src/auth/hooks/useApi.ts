import { useAuth } from "../../shared/hooks/useAuth";

export class Api {
  static API_BASE = import.meta.env.VITE_API_URL;

  static tokenProvider: (() => Promise<string>) | null = null;

  static setTokenProvider(provider: () => Promise<string>) {
    Api.tokenProvider = provider;
  }

  static get<TRes>(
    path: string,
    params: URLSearchParams | null
  ) {
    return Api.fetchApi<any, TRes>("GET", path, params, null);
  }

  static post<TReq = any, TRes = any>(
    path: string,
    body: TReq
  ) {
    return Api.fetchApi<TReq, TRes>("POST", path, null, body);
  }

  static delete<TRes>(path: string) {
    return Api.fetchApi<any, TRes>("DELETE", path, null, null);
  }

  static async fetchApi<TReq = any, TRes = any>(
    method: string,
    path: string,
    query: URLSearchParams | null,
    body: TReq
  ) {
    let url = Api.API_BASE + path;

    if (query?.size) {
      url += "?" + query;
    }

    const accessToken = await Api.tokenProvider?.();
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
