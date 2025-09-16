import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie, MovieService } from '../../core/movie.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage movies from OMDB API and your database</p>
    </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">🎬</div>
          <div class="stat-content">
            <h3>{{ movieStats().totalMovies }}</h3>
            <p>Total Movies</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ userStats().totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      <!-- OMDB Search Section -->
      <div class="search-section">
        <div class="search-toolbar">
          <div class="search-input-group">
            <input 
              placeholder="Search movies on OMDB..." 
              [(ngModel)]="query" 
              class="search-input"
            />
            <button (click)="searchOmdb()" class="btn btn-primary">Search</button>
            <button (click)="fetchAndSave()" [disabled]="!query" class="btn btn-success">Fetch & Save</button>
          </div>
        </div>

        <div class="error-message" *ngIf="error()">{{ error() }}</div>

        <div class="search-results" *ngIf="omdbResults().length">
          <h3>Search Results</h3>
          <div class="movie-grid">
            <div class="movie-card" *ngFor="let m of omdbResults()">
              <div class="movie-poster">
                <img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="300" height="200" />
              </div>
              <div class="movie-info">
                <h4>{{ m.title }}</h4>
                <p>{{ m.year }}</p>
                <button (click)="add(m)" class="btn btn-primary btn-sm">Add to Database</button>
              </div>
            </div>
        </div>
      </div>
    </div>

      <!-- Database Movies Section -->
      <div class="database-section">
        <div class="section-header">
    <h3>Database Movies</h3>
          <button (click)="deleteSelected()" [disabled]="!selectedIds().length" class="btn btn-danger">
            Delete Selected ({{ selectedIds().length }})
          </button>
        </div>
        
        <div class="movie-grid">
          <div class="movie-card db-movie" *ngFor="let m of dbMovies()">
            <div class="movie-checkbox">
              <input 
                type="checkbox" 
                [checked]="selectedIds().includes(m.id!)" 
                (change)="toggleSelect(m.id!)" 
              />
            </div>
            <div class="movie-poster">
              <img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="80" height="120" />
            </div>
            <div class="movie-info">
              <h4>{{ m.title }}</h4>
              <p>{{ m.year }}</p>
              <button (click)="remove(m.id!)" class="btn btn-danger btn-sm">Remove</button>
            </div>
          </div>
    </div>

        <div class="pagination" *ngIf="totalPages() > 1">
          <button (click)="prevPage()" [disabled]="page()===0" class="btn btn-secondary">Previous</button>
          <span class="page-info">Page {{ page()+1 }} of {{ totalPages() }}</span>
          <button (click)="nextPage()" [disabled]="page()+1>=totalPages()" class="btn btn-secondary">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .admin-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .admin-header h1 {
      color: var(--accent);
      font-size: 2.5rem;
      margin: 0 0 10px 0;
    }
    
    .admin-header p {
      color: var(--muted);
      font-size: 1.1rem;
      margin: 0;
    }
    
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: var(--surface);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-700) 100%);
      border-radius: 12px;
    }
    
    .stat-content h3 {
      color: #fff;
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    
    .stat-content p {
      color: var(--muted);
      font-size: 0.9rem;
      margin: 0;
    }
    
    .search-section, .database-section {
      background: var(--surface);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
      box-shadow: var(--shadow);
    }
    
    .search-toolbar {
      margin-bottom: 20px;
    }
    
    .search-input-group {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .search-input {
      flex: 1;
      min-width: 300px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      background: var(--surface-2);
      color: var(--text);
      font-size: 1rem;
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
    }
    
    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: var(--primary-700);
      transform: translateY(-2px);
    }
    
    .btn-success {
      background: var(--accent);
      color: #fff;
    }
    
    .btn-success:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
    }
    
    .btn-danger {
      background: var(--danger);
      color: #fff;
    }
    
    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: var(--surface-2);
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    
    .btn-secondary:hover:not(:disabled) {
      background: var(--surface);
      transform: translateY(-2px);
    }
    
    .btn-sm {
      padding: 8px 12px;
      font-size: 0.9rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--danger);
      padding: 12px 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .section-header h3 {
      color: var(--accent);
      margin: 0;
      font-size: 1.5rem;
    }
    
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .movie-card {
      background: var(--surface-2);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    .movie-card.db-movie {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
    }
    
    .movie-checkbox {
      margin-top: 8px;
    }
    
    .movie-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
    }
    
    .movie-poster {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    
    .movie-card.db-movie .movie-poster {
      width: 80px;
      height: 120px;
      flex-shrink: 0;
    }
    
    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: var(--surface);
    }
    
    .movie-info {
      padding: 16px;
    }
    
    .movie-card.db-movie .movie-info {
      padding: 0;
      flex: 1;
    }
    
    .movie-info h4 {
      color: #fff;
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .movie-info p {
      color: var(--muted);
      margin: 0 0 12px 0;
      font-size: 0.9rem;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 30px;
    }
    
    .page-info {
      color: var(--text);
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .admin-container {
        padding: 16px;
      }
      
      .search-input-group {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-input {
        min-width: auto;
      }
      
      .section-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .movie-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent {
  private readonly movies = inject(MovieService);
  private readonly auth = inject(AuthService);

  query = '';
  omdbResults = signal<Movie[]>([]);
  dbMovies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(8);
  totalPages = signal(1);
  selectedIds = signal<number[]>([]);
  error = signal<string | null>(null);
  movieStats = signal({totalMovies: 0});
  userStats = signal({totalUsers: 0});

  constructor() {
    this.loadDb();
    this.loadStats();
  }

  loadDb() {
    this.error.set(null);
    this.movies.getAll(this.page(), this.size()).subscribe((p) => {
      this.dbMovies.set(p.content);
      this.totalPages.set(p.totalPages || 1);
      this.selectedIds.set([]);
    });
  }

  searchOmdb() {
    if (!this.query) return;
    this.error.set(null);
    this.movies.searchOmdb(this.query).subscribe((res) => this.omdbResults.set(res));
  }

  fetchAndSave() {
    if (!this.query) return;
    this.error.set(null);
    this.movies.fetchAndSave(this.query).subscribe({
      next: () => this.loadDb(),
      error: (err) => this.handleErr(err)
    });
  }

  add(m: Movie) {
    this.error.set(null);
    this.movies.add(m).subscribe({
      next: () => this.loadDb(),
      error: (err) => this.handleErr(err)
    });
  }

  remove(id: number) {
    this.error.set(null);
    this.movies.delete(id).subscribe({
      next: () => this.loadDb(),
      error: (err) => this.handleErr(err)
    });
  }

  toggleSelect(id: number) {
    const set = new Set(this.selectedIds());
    if (set.has(id)) set.delete(id); else set.add(id);
    this.selectedIds.set([...set]);
  }

  deleteSelected() {
    this.error.set(null);
    this.movies.deleteBatch(this.selectedIds()).subscribe({
      next: () => this.loadDb(),
      error: (err) => this.handleErr(err)
    });
  }

  nextPage() {
    this.page.set(this.page() + 1);
    this.loadDb();
  }
  prevPage() {
    this.page.set(Math.max(0, this.page() - 1));
    this.loadDb();
  }

  private handleErr(err: any) {
    if (err?.status === 403) this.error.set('Forbidden: Admin privileges required.');
    else this.error.set('Action failed.');
  }

  loadStats() {
    this.movies.getStats().subscribe(stats => this.movieStats.set(stats));
    this.auth.getUserStats().subscribe(stats => this.userStats.set(stats));
  }
}



