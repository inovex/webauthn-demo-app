import { Injectable } from '@angular/core';
import { fromByteArray, toByteArray } from 'base64-js';
import { from, Observable } from 'rxjs';
import { PublicKeyCredentialAssertionResponse, PublicKeyCredentialAttestationResponse } from '@/_models/publicKeyCredentialResponses';

@Injectable({
    providedIn: 'root'
})
export class WebAuthnService {

    constructor() {
    }

    public makeCredential(publicKey: PublicKeyCredentialCreationOptions): Observable<PublicKeyCredentialAttestationResponse> {

        return from(navigator.credentials.create({ publicKey: this.decodePublicKeyCredentialCreationOptions(publicKey) })
            .then(newCredentialInfo => newCredentialInfo as PublicKeyCredential)
            .then(publicKeyCredential => this.encodePublicKeyCredentialAttestation(publicKeyCredential))
            .catch((error) => {
                throw new Error('Unauthorised');
            }));
    }

    public createAssertion(publicKey: PublicKeyCredentialRequestOptions): Observable<PublicKeyCredentialAssertionResponse> {
        return from(navigator.credentials.get({ publicKey: this.decodePublicKeyCredentialRequestOptions(publicKey) })
            .then(response => response as PublicKeyCredential)
            .then(publicKeyCredential => this.encodePublicKeyCredentialAssertion(publicKeyCredential))
            .catch((error) => {
                throw new Error('Unauthorised');
            }));
    }

    private stringToByteArray(str: string): Uint8Array {
        str = str + '===='.substring(0, (4 - (str.length % 4)) % 4);
        return toByteArray(str);
    }

    private handleByteArray(input: ArrayBuffer): ArrayBuffer {
        return fromByteArray(new Uint8Array(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    private extend(obj: any, more: any): any {
        return Object.assign({}, obj, more);
    }

    private decodePublicKeyCredentialCreationOptions(request): PublicKeyCredentialCreationOptions {
        const excludeCredentials = request.excludeCredentials.map(credential => this.extend(
            credential, {
            id: this.stringToByteArray(credential.id),
        }));

        const publicKeyCredentialCreationOptions = this.extend(
            request, {
            attestation: 'direct',
            user: this.extend(
                request.user, {
                id: this.stringToByteArray(request.user.id),
            }),
            challenge: this.stringToByteArray(request.challenge),
            excludeCredentials,
        });

        return publicKeyCredentialCreationOptions;
    }

    private decodePublicKeyCredentialRequestOptions(request): PublicKeyCredentialRequestOptions {
        const allowCredentials = request.allowCredentials && request.allowCredentials.map(credential => this.extend(
            credential, {
            id: this.stringToByteArray(credential.id),
        }));

        const publicKeyCredentialRequestOptions = this.extend(
            request, {
            allowCredentials,
            challenge: this.stringToByteArray(request.challenge),
        });

        return publicKeyCredentialRequestOptions;
    }

    private encodePublicKeyCredentialAttestation(response): PublicKeyCredentialAttestationResponse {
        const clientExtensionResults = {};
        return {
            id: response.id,
            type: response.type,
            clientExtensionResults,
            response: {
                attestationObject: this.handleByteArray(response.response.attestationObject),
                clientDataJSON: this.handleByteArray(response.response.clientDataJSON),
            }
        };
    }

    private encodePublicKeyCredentialAssertion(response): PublicKeyCredentialAssertionResponse {
        const clientExtensionResults = {};
        return {
            id: response.id,
            type: response.type,
            clientExtensionResults,
            response: {
                authenticatorData: this.handleByteArray(response.response.authenticatorData),
                clientDataJSON: this.handleByteArray(response.response.clientDataJSON),
                signature: this.handleByteArray(response.response.signature),
                userHandle: response.response.userHandle && this.handleByteArray(response.response.userHandle),
            }
        };
    }
}
