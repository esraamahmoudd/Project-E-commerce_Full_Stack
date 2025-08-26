import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: '../../users/login/login.html',
  styleUrl: '../../users/login/login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Simulate API request
    setTimeout(() => {
      this.loading = false;

      const { email, password } = this.loginForm.value;

      if (email === 'test@example.com' && password === '123456') {
        this.router.navigate(['/profile']);
      } else {
        this.errorMessage = 'Invalid email or password!';
      }
    }, 1500);
  }
}
