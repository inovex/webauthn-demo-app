import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { User } from '@/_models/user';
import { AuthenticationService } from '@/_services/authentication.service';
import { UserService } from '@/_services/user.service';
import { AlertService } from '@/_services/alert.service';
import { WebAuthnService } from '@/_services/web-authn.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private webAuthnService: WebAuthnService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    // convenience getter for easy access to form fields
    get formControls() {
        return this.registerForm.controls as {
            firstname: AbstractControl;
            lastname: AbstractControl;
            email: AbstractControl;
        };
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        const user: User = this.registerForm.value as User;

        let reqId: string;

        this.userService.getPublicKeyCredentialCreationOptionsRequest(user).pipe(
            switchMap(publicKeyCredentialCreationOptionsRequest => {
                reqId = publicKeyCredentialCreationOptionsRequest.requestId;
                return this.webAuthnService.makeCredential(publicKeyCredentialCreationOptionsRequest.publicKeyCredentialCreationOptions);
            }),
            switchMap(publicKeyCredentialResponse => {
                return this.userService.finishCrossPlatformChallenge(publicKeyCredentialResponse, reqId);
            })
        ).subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
