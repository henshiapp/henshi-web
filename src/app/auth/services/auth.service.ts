import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private readonly auth: AuthService) {}

    get accessToken() {
        return this.auth.getAccessTokenSilently();
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
        return this.auth.loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin + '/app/dashboard' } });
    }

    register() {
        return this.auth.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })
    }

    logout() {
        return this.auth.logout();
    }
}