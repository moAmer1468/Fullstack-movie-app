import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar.component';
import { FooterComponent } from './shared/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('movie-frontend');
}
