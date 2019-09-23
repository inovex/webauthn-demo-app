import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@/_models/user';
import { AuthenticationService } from '@/_services/authentication.service';
import { UserService } from '@/_services/user.service';
import { AlertService } from '@/_services/alert.service';

@Component({templateUrl: 'settings.component.html'})
export class SettingsComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    loadingCrossPlatform = false;
    loadingPlatform = false;


    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.currentUser = authenticationService.currentUserValue;
    }

    ngOnInit() {
        // this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    addCrossPlatform() {
        this.loadingCrossPlatform = true;
        /*this.userService.getPublicKeyCredentialCreationOptionsRequest(this.currentUser).pipe(
            switchMap(data => {
                // TODO: Register challenge checks?
                return makeCredential(data as PublicKeyCredentialCreationOptions);
            }),
            switchMap(data => {
                return this.addNewCredential(data);
            })
        ).subscribe(
            data => {
                this.alertService.success('Security key registration successful', true);
                this.loadingCrossPlatform = false;
            },
            error => {
                this.alertService.error(error);
                this.loadingCrossPlatform = false;
            });

         */
    }

    addPlatform() {
        this.loadingPlatform = true;
        /*
        this.userService.makePlatformChallenge(this.currentUser).pipe(
            switchMap(data => {
                // TODO: Register challenge checks?
                return makeCredential(data as PublicKeyCredentialCreationOptions);
            })
        ).subscribe(
            data => {
                this.alertService.success('Fingerprint registration successful', true);
                this.loadingPlatform = false;
            },
            error => {
                this.alertService.error(error);
                this.loadingPlatform = false;
            });
         */
    }
}
