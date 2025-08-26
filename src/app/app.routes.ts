import { Routes } from '@angular/router';
import { Login } from './components/users/login/login';
import { NotFound } from './components/not-found/not-found';
import { Register } from './components/users/register/register';
import { Profile } from './components/users/profile/profile';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
     { path: '',
       redirectTo: '/login', 
       pathMatch: 'full' 
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path:'**',
        component:NotFound
    }
];
