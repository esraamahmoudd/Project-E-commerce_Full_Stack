import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/users/login/login';
import { Register } from './components/users/register/register';
import { Profile } from './components/users/profile/profile';
import {  ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Login,Register,Profile,ReactiveFormsModule,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lab');
}
