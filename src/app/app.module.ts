﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { ErrorInterceptor } from '@/_helpers/error.interceptor';
import { AlertComponent } from '@/_components/alert.component';
import { HomeComponent } from '@/home/home.component';
import { LoginComponent } from '@/login/login.component';
import { RegisterComponent } from '@/register/register.component';
import { SettingsComponent } from '@/settings/settings.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        SettingsComponent
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
