import { Auth0ProviderOptions } from "@auth0/auth0-react";

export const auth0Config: Auth0ProviderOptions = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email offline_access"
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
}
