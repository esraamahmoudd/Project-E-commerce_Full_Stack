import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Userservice } from '../../../user/services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  loading = false;
  error: string = '';
   successMessage: string = '';
  formErrors: any = {};

  constructor(private fb: FormBuilder, private userService: Userservice, private router: Router) {
    this.registerForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(3)]],
      LastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onFieldBlur(field: string) {
    const control = this.registerForm.get(field);
    if (control && control.invalid && (control.dirty || control.touched)) {
      this.formErrors[field] = this.getErrorMessage(field, control.errors);
    }
  }

  onFieldInput(field: string) {
    const control = this.registerForm.get(field);
    if (control && control.valid) {
      this.formErrors[field] = '';
    }
  }

  getErrorMessage(field: string, errors: any): string {
    if (errors['required']) return `${field} is required`;
    if (errors['minlength']) return `${field} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['email']) return `Enter a valid email`;
    if (errors['mismatch']) return `Passwords do not match`;
    return `Invalid ${field}`;
  }

  onSubmit() {
     if (this.registerForm.valid) {
    this.loading = true;
    this.error = '';

    const payload = {
      FirstName: this.registerForm.value.FirstName,
      LastName: this.registerForm.value.LastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };

    this.userService.register(payload).subscribe({
      next: () => {
        this.loading = false;
           this.successMessage = '✅ Account Created Successfully!';
        this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        },
      
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
}
