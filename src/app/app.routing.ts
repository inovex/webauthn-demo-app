import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@/home/home.component';
import { AuthGuard } from '@/_guards/auth.guard';
import { LoginComponent } from '@/login/login.component';
import { RegisterComponent } from '@/register/register.component';
import { SettingsComponent } from '@/settings/settings.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full'},
    {path: 'login', component: LoginComponent, pathMatch: 'full'},
    {path: 'register', component: RegisterComponent, pathMatch: 'full'},
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], pathMatch: 'full'},

    // otherwise redirect to home
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(appRoutes);
