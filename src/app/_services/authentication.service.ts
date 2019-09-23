import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PublicKeyCredentialRequestOptionsRequest } from '@/_models/publicKeyCredentialRequests';
import { User } from '@/_models/user';
import { PublicKeyCredentialAssertionResponse } from '@/_models/publicKeyCredentialResponses';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    startAuthentication(
        email: string
    ): Observable<PublicKeyCredentialRequestOptionsRequest> {
        const httpParams: HttpParams = new HttpParams().set('username', email);

        return this.http.post(environment.urls.authenticate, httpParams).pipe(
            map((response: { request: PublicKeyCredentialRequestOptionsRequest }) => {
                const credRequest = response.request;
                return credRequest;
            })
        );
    }

    finishAuthentication(publicKeyCredential: PublicKeyCredentialAssertionResponse, requestId: string) {
        const body = {
            requestId,
            credential: publicKeyCredential,
        };

        interface UserIdentity {
            id: string;
            name: string;
            displayName: string;
        }

        interface FinishAuthenticateResponse {
            registrations: {
                userIdentity: UserIdentity
            }[];
        }

        return this.http.post(environment.urls.finishAuthenticate, JSON.stringify(body)).pipe(
            map((response: FinishAuthenticateResponse) => response.registrations[0].userIdentity),
            map((user: UserIdentity) => {
                this.currentUserSubject.next(new User(user.id, user.name, user.displayName));
            })
        );
    }

    deauthenticate() {
        this.currentUserSubject.next(null);
        this.currentUserSubject.unsubscribe();
    }
}
