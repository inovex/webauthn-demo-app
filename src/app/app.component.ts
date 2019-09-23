import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@/_models/user';
import { AuthenticationService } from '@/_services/authentication.service';
import { AlertService } from '@/_services/alert.service';

@Component({ selector: 'app-main', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {

        this.authenticationService.currentUser.subscribe(
            user => (this.currentUser = user)
        );
    }

    logout() {
        this.authenticationService.deauthenticate();
        this.router.navigate(['/login']);
        this.alertService.success('Logout successful');
    }
}
