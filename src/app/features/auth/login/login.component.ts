import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginHeaderComponent } from '../../../shared/components/header/login-header.component';
import { LoginFooterComponent } from '../../../shared/components/footer/login-footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoginHeaderComponent,
    LoginFooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const credentials = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.error = error.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    
    switch (role) {
      case 'admin':
        this.router.navigate(['/dashboard']);
        break;
      case 'waiter':
        this.router.navigate(['/orders']);
        break;
      case 'chef':
        this.router.navigate(['/kitchen']);
        break;
      case 'cashier':
        this.router.navigate(['/billing']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}
