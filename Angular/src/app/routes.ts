import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '',  component: HomeComponent, data: { title: 'Versa - Home' } },
    { path: 'signup', component: SignupComponent, data: { title: 'Versa - Signup' } },
    { path: 'login', component: LoginComponent, data: {title: 'Versa - Login'} },
];
