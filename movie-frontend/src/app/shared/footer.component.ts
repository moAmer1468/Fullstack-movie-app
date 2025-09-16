import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>MovieApp</h4>
          <p>Your ultimate movie collection and rating platform</p>
        </div>
        <div class="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Browse Movies</li>
            <li>Rate & Review</li>
            <li>Admin Management</li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Powered by</h4>
          <p>OMDB API</p>
          <p>Angular & Spring Boot</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 MovieApp. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--surface);
      border-top: 1px solid var(--card-border);
      margin-top: 60px;
      padding: 40px 20px 20px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .footer-section h4 {
      color: var(--accent);
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    
    .footer-section p {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0 0 8px 0;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section li {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 6px;
    }
    
    .footer-bottom {
      border-top: 1px solid var(--card-border);
      padding-top: 20px;
      text-align: center;
    }
    
    .footer-bottom p {
      color: var(--muted);
      font-size: 0.8rem;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class FooterComponent {}


