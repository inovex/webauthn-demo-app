class PublicKeyCredentialResponse {
    type: string;
    id: string;
    clientExtensionResults: {};
}

export class PublicKeyCredentialAttestationResponse extends PublicKeyCredentialResponse {
    response: AuthenticatorAttestationResponse;
}

export class PublicKeyCredentialAssertionResponse extends PublicKeyCredentialResponse {
    response: AuthenticatorAssertionResponse;
}
