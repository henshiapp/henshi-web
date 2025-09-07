import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    accessToken?: string;

    constructor(private readonly auth: AuthService) {
        auth.getAccessTokenSilently()
            .subscribe({
                next: token => this.accessToken = token,
                error: () => {
                    // TODO: Fix access token retrieval error
                }
            });
    }

    get user$() {
        return this.auth.user$;
    }

    get isAuthenticated$() {
        return this.auth.isAuthenticated$;
    }

    get accessToken$() {
        return this.auth.getAccessTokenSilently();
    }

    login() {
        return this.auth.loginWithRedirect();
    }

    register() {
        return this.auth.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })
    }

    logout() {
        return this.auth.logout();
    }
}