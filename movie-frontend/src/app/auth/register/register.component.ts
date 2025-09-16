import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>MovieApp</h1>
          <p>Create a new account</p>
        </div>
        <form (ngSubmit)="onSubmit()" #f="ngForm" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username"
              [(ngModel)]="username" 
              name="username" 
              type="text"
              placeholder="Choose a username"
              required 
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              [(ngModel)]="password" 
              name="password" 
              type="password"
              placeholder="Choose a password"
              required 
            />
          </div>
          <button type="submit" class="login-btn" [disabled]="loading()">
            <span *ngIf="!loading()">Register</span>
            <span *ngIf="loading()">Creating account...</span>
          </button>
          <div class="error-message" *ngIf="error()">
            {{ error() }}
          </div>
        </form>
        <div class="login-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-header h1 {
      color: #fff;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 10px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .login-header p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      font-size: 1.1rem;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      color: #fff;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .form-group input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-size: 1rem;
    }
    
    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .login-btn {
      background: linear-gradient(to right, #4776E6, #8E54E9);
      border: none;
      border-radius: 10px;
      padding: 14px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 10px;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .login-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .error-message {
      color: #ff6b6b;
      text-align: center;
      margin-top: 15px;
      font-size: 0.9rem;
    }
    
    .login-footer {
      margin-top: 30px;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
    
    .login-footer a {
      color: #fff;
      text-decoration: underline;
      font-weight: 500;
    }
    
    @media (max-width: 480px) {
      .login-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}