import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '@/_models/user';
import { PublicKeyCredentialCreationOptionsRequest } from '@/_models/publicKeyCredentialRequests';
import { PublicKeyCredentialAttestationResponse } from '@/_models/publicKeyCredentialResponses';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) {
    }

    getPublicKeyCredentialCreationOptionsRequest(user: User): Observable<PublicKeyCredentialCreationOptionsRequest> {
        const httpParams: HttpParams = new HttpParams()
            .set('username', user.email)
            .set('displayName', user.firstname + ' ' + user.lastname)
            .set('credentialNickname', user.firstname)
            .set('requireResidentKey', 'false');

        return this.http.post(environment.urls.register, httpParams).pipe(
            map(
                (response: { request: PublicKeyCredentialCreationOptionsRequest }) => {
                    const credRequest = response.request;
                    return credRequest;
                }
            )
        );
    }

    finishCrossPlatformChallenge(publicKeyCredential: PublicKeyCredentialAttestationResponse, requestId: string): Observable<any> {
        const body = {
            requestId,
            credential: publicKeyCredential,
        };

        return this.http.post(environment.urls.finishRegister, JSON.stringify(body));
    }
}
