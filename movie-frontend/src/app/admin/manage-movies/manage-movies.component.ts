import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie, MovieService } from '../../core/movie.service';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Manage Movies</h1>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="tab()==='search'" (click)="tab.set('search')">Search & Add</button>
        <button class="tab" [class.active]="tab()==='db'" (click)="tab.set('db')">Database Movies</button>
      </div>

      <div *ngIf="tab()==='search'" class="search-section">
        <div class="search-input-group">
          <input placeholder="Search OMDB..." [(ngModel)]="query" class="search-input" />
          <button (click)="searchOmdb()" class="btn btn-primary">Search</button>
          <button (click)="fetchAndSave()" [disabled]="!query" class="btn btn-success">Fetch & Save</button>
        </div>
        <div class="error-message" *ngIf="error()">{{ error() }}</div>
        <div class="movie-grid">
          <div class="movie-card" *ngFor="let m of omdbResults()">
            <div class="movie-poster"><img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="300" height="200" /></div>
            <div class="movie-info">
              <h4>{{ m.title }}</h4>
              <p>{{ m.year }}</p>
              <button (click)="add(m)" class="btn btn-primary btn-sm">Add to Database</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="tab()==='db'" class="database-section">
        <div class="section-header">
          <h3>Database Movies</h3>
          <button (click)="deleteSelected()" [disabled]="!selectedIds().length" class="btn btn-danger">
            Delete Selected ({{ selectedIds().length }})
          </button>
        </div>
        <div class="movie-grid">
          <div class="movie-card db-movie" *ngFor="let m of dbMovies()">
            <div class="movie-checkbox">
              <input type="checkbox" [checked]="selectedIds().includes(m.id!)" (change)="toggleSelect(m.id!)" />
            </div>
            <div class="movie-poster"><img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" width="80" height="120" /></div>
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
  styles: [``]
})
export class ManageMoviesComponent {
  private readonly movies = inject(MovieService);

  tab = signal<'search' | 'db'>('search');
  query = '';
  omdbResults = signal<Movie[]>([]);
  dbMovies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(8);
  totalPages = signal(1);
  selectedIds = signal<number[]>([]);
  error = signal<string | null>(null);

  constructor() { this.loadDb(); }

  loadDb() {
    this.movies.getAll(this.page(), this.size()).subscribe((p) => {
      this.dbMovies.set(p.content);
      this.totalPages.set(p.totalPages || 1);
      this.selectedIds.set([]);
    });
  }

  searchOmdb() { if (!this.query) return; this.error.set(null); this.movies.searchOmdb(this.query).subscribe((res) => this.omdbResults.set(res)); }
  fetchAndSave() { if (!this.query) return; this.error.set(null); this.movies.fetchAndSave(this.query).subscribe({ next: () => this.loadDb(), error: (e) => this.handleErr(e) }); }
  add(m: Movie) { this.error.set(null); this.movies.add(m).subscribe({ next: () => this.loadDb(), error: (e) => this.handleErr(e) }); }
  remove(id: number) { this.error.set(null); this.movies.delete(id).subscribe({ next: () => this.loadDb(), error: (e) => this.handleErr(e) }); }
  toggleSelect(id: number) { const set = new Set(this.selectedIds()); if (set.has(id)) set.delete(id); else set.add(id); this.selectedIds.set([...set]); }
  deleteSelected() { this.error.set(null); this.movies.deleteBatch(this.selectedIds()).subscribe({ next: () => this.loadDb(), error: (e) => this.handleErr(e) }); }
  nextPage() { this.page.set(this.page()+1); this.loadDb(); }
  prevPage() { this.page.set(Math.max(0, this.page()-1)); this.loadDb(); }
  private handleErr(err: any) { if (err?.status === 403) this.error.set('Forbidden: Admin privileges required.'); else this.error.set('Action failed.'); }
}

