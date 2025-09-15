import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()" #f="ngForm">
        <label>Username</label>
        <input [(ngModel)]="username" name="username" required />
        <label>Password</label>
        <input [(ngModel)]="password" name="password" type="password" required />
        <button type="submit" [disabled]="loading()">Login</button>
        <div class="error" *ngIf="error()">{{ error() }}</div>
      </form>
    </div>
  `,
  styles: [
    `.container{max-width:400px;margin:40px auto;display:flex;flex-direction:column;gap:12px}`,
    `label{display:block;margin-top:8px}`,
    `input{width:100%;padding:8px}`,
    `.error{color:#c00;margin-top:8px}`
  ]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(typeof err?.error === 'string' ? err.error : 'Login failed');
      }
    });
  }
}



