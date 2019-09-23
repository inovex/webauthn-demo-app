class PublicKeyCredentialRequest {
    username: string;
    credentialNickname: string;
    requestId: string;
}

export class PublicKeyCredentialRequestOptionsRequest extends PublicKeyCredentialRequest {
    publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions;
}

export class PublicKeyCredentialCreationOptionsRequest extends PublicKeyCredentialRequest {
    publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions;
}
