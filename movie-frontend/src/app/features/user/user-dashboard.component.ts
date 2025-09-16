import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/movie.service';
import { RecommendationService } from '../../core/recommendation.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="user-container">
      <div class="user-header">
        <h1>Movie Collection</h1>
        <p>Browse and discover movies added by administrators</p>
      </div>

      <div class="search-section">
        <div class="search-toolbar">
          <div class="search-input-group">
            <input 
              placeholder="Search movies..." 
              [(ngModel)]="query" 
              class="search-input"
            />
            <button (click)="search()" class="btn btn-primary">Search</button>
            <button (click)="clearSearch()" *ngIf="query" class="btn btn-secondary">Clear</button>
          </div>
        </div>
      </div>

      <div class="preferences-section" *ngIf="!query">
        <div class="section-header">
          <h3>Your Preferences</h3>
          <button class="btn btn-secondary btn-sm" (click)="togglePreferencesEdit()">
            {{ editingPreferences() ? 'Save' : 'Edit' }}
          </button>
        </div>
        
        <div class="preferences-content" *ngIf="!editingPreferences()">
          <div class="genre-tags" *ngIf="preferences().length > 0">
            <span class="genre-tag" *ngFor="let genre of preferences()">
              {{ genre }}
            </span>
          </div>
          <p *ngIf="preferences().length === 0">No preferences set. Edit to add your favorite genres.</p>
        </div>
        
        <div class="preferences-edit" *ngIf="editingPreferences()">
          <div class="genre-selection">
            <div class="genre-option" *ngFor="let genre of availableGenres">
              <label>
                <input 
                  type="checkbox" 
                  [checked]="isGenreSelected(genre)" 
                  (change)="toggleGenre(genre)"
                />
                {{ genre }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="recommendations-section" *ngIf="!query && recommendations().length > 0">
        <div class="section-header">
          <h3>Recommended For You</h3>
        </div>
        <div class="movie-grid">
          <div class="movie-card" *ngFor="let m of recommendations()">
            <div class="movie-poster">
              <img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="300" height="200" />
            </div>
            <div class="movie-info">
              <h4>{{ m.title }}</h4>
              <p>{{ m.year }}</p>
              <a [routerLink]="['/movies', m.id]" class="btn btn-primary btn-sm">View Details</a>
            </div>
          </div>
        </div>
      </div>

      <div class="movies-section">
        <div class="section-header">
          <h3>{{ query ? 'Search Results' : 'All Movies' }}</h3>
          <span class="movie-count">{{ movies().length }} movie{{ movies().length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="movie-grid" *ngIf="movies().length > 0">
          <div class="movie-card" *ngFor="let m of movies()">
            <div class="movie-poster">
              <img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="300" height="200" />
            </div>
            <div class="movie-info">
              <h4>{{ m.title }}</h4>
              <p>{{ m.year }}</p>
              <a [routerLink]="['/movies', m.id]" class="btn btn-primary btn-sm">View Details</a>
            </div>
          </div>
        </div>

        <div class="no-movies" *ngIf="movies().length === 0">
          <div class="no-movies-icon">🎬</div>
          <h3>No movies found</h3>
          <p *ngIf="query">Try adjusting your search terms</p>
          <p *ngIf="!query">No movies have been added to the collection yet</p>
        </div>

        <div class="pagination" *ngIf="totalPages() > 1 && !query">
          <button (click)="prevPage()" [disabled]="page()===0" class="btn btn-secondary">Previous</button>
          <span class="page-info">Page {{ page()+1 }} of {{ totalPages() }}</span>
          <button (click)="nextPage()" [disabled]="page()+1>=totalPages()" class="btn btn-secondary">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .user-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .user-header h1 {
      color: var(--accent);
      font-size: 2.5rem;
      margin: 0 0 10px 0;
    }
    
    .user-header p {
      color: var(--muted);
      font-size: 1.1rem;
      margin: 0;
    }
    
    .search-section, .movies-section, .preferences-section, .recommendations-section {
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
    
    .movie-count {
      color: var(--muted);
      font-size: 0.9rem;
      background: var(--surface-2);
      padding: 6px 12px;
      border-radius: 20px;
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
    
    .movie-poster {
      width: 100%;
      height: 200px;
      overflow: hidden;
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
    
    .no-movies {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted);
    }
    
    .no-movies-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    .no-movies h3 {
      color: var(--text);
      margin: 0 0 10px 0;
      font-size: 1.5rem;
    }
    
    .no-movies p {
      margin: 0;
      font-size: 1rem;
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
    
    .genre-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .genre-tag {
      background: var(--primary);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    
    .preferences-content,
    .preferences-edit {
      margin-top: 15px;
    }
    
    .genre-selection {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    
    .genre-option {
      display: flex;
      align-items: center;
    }
    
    .genre-option label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text);
    }
    
    @media (max-width: 768px) {
      .user-container {
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
      
      .genre-selection {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }
    }
  `]
})
export class UserDashboardComponent {
  private readonly moviesApi = inject(MovieService);
  private readonly recommendationService = inject(RecommendationService);

  query = '';
  movies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(12);
  totalPages = signal(1);
  recommendations = signal<Movie[]>([]);
  preferences = signal<string[]>([]);
  editingPreferences = signal<boolean>(false);
  
  // Available genres for selection
  availableGenres: string[] = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
    'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  // Selected genres for preferences
  selectedGenres: string[] = [];

  constructor() {
    this.load();
    this.loadRecommendations();
    this.loadPreferences();
  }

  load() {
    this.moviesApi.getAll(this.page(), this.size()).subscribe((p) => {
      this.movies.set(p.content);
      this.totalPages.set(p.totalPages || 1);
    });
  }

  loadRecommendations() {
    this.recommendationService.getRecommendations().subscribe(data => {
      this.recommendations.set(data);
    });
  }

  loadPreferences() {
    this.recommendationService.getUserPreferences().subscribe(data => {
      this.preferences.set(data);
      this.selectedGenres = [...data];
    });
  }

  togglePreferencesEdit() {
    if (this.editingPreferences()) {
      // Save preferences
      this.recommendationService.updatePreferences(this.selectedGenres).subscribe(data => {
        this.preferences.set(data);
        this.editingPreferences.set(false);
        // Reload recommendations based on new preferences
        this.loadRecommendations();
      });
    } else {
      // Enter edit mode
      this.editingPreferences.set(true);
    }
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  toggleGenre(genre: string) {
    if (this.isGenreSelected(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres = [...this.selectedGenres, genre];
    }
  }

  search() {
    if (!this.query) return this.load();
    this.moviesApi.searchDb(this.query).subscribe((res) => this.movies.set(res));
  }

  nextPage() { this.page.set(this.page()+1); this.load(); }
  prevPage() { this.page.set(Math.max(0, this.page()-1)); this.load(); }
  
  clearSearch() {
    this.query = '';
    this.load();
  }
}



