import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Observable, catchError, switchMap, throwError } from "rxjs";

@Injectable()
export class AuthRetryInterceptor implements HttpInterceptor {
    private auth = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return this.auth.getAccessTokenSilently().pipe(
                        switchMap((token) => {
                            const retryReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            return next.handle(retryReq);
                        }),
                        catchError((err) => {
                            if (err.error === 'missing_refresh_token' || err.error === 'invalid_grant') {
                                this.auth.loginWithRedirect();
                            }
                            return throwError(() => err);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}