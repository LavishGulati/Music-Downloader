import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',  component: HomeComponent, data: { title: 'Versa - Home' } },
    { path: 'signup', component: SignupComponent, data: { title: 'Versa - Signup' } }
];
