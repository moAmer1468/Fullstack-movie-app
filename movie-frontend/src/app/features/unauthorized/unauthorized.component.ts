import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="error-icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="sub-text">This page is restricted to administrators only.</p>
        <div class="actions">
          <a routerLink="/user/dashboard" class="btn btn-primary">Go to User Dashboard</a>
          <a routerLink="/login" class="btn btn-secondary">Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .unauthorized-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .error-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #fff;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      margin: 0 0 15px 0;
    }
    
    .sub-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin-bottom: 30px;
    }
    
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-block;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      color: #fff;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `]
})
export class UnauthorizedComponent {}
