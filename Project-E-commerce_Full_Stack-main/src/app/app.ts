import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/users/login/login';
import { Register } from './components/users/register/register';
import { Profile } from './components/users/profile/profile';
import {  ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Login,Register,Profile,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lab');
}
