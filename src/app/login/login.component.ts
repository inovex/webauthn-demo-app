import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@/_services/authentication.service';
import { AlertService } from '@/_services/alert.service';
import { WebAuthnService } from '@/_services/web-authn.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private webAuthnService: WebAuthnService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    // convenience getter for easy access to form fields
    get formControls() {
        return this.loginForm.controls as { email: AbstractControl };
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        let reqId: string;

        this.authenticationService
            .startAuthentication(this.formControls.email.value)
            .pipe(
                switchMap(publicKeyCredentialRequestOptionRequest => {
                    reqId = publicKeyCredentialRequestOptionRequest.requestId;
                    return this.webAuthnService.createAssertion(
                        publicKeyCredentialRequestOptionRequest.publicKeyCredentialRequestOptions
                    );
                }),
                switchMap(publicKeyCredentialResponse => {
                    return this.authenticationService.finishAuthentication(
                        publicKeyCredentialResponse,
                        reqId
                    );
                })
            )
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    this.alertService.success('Login successful');
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            );
    }
}
