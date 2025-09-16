import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/movie.service';

@Component({
  selector: 'app-user-movies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="user-container">
      <div class="user-header">
        <h1>All Movies</h1>
        <p>Explore the full collection</p>
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

      <div class="pagination" *ngIf="totalPages() > 1 && !query">
        <button (click)="prevPage()" [disabled]="page()===0" class="btn btn-secondary">Previous</button>
        <span class="page-info">Page {{ page()+1 }} of {{ totalPages() }}</span>
        <button (click)="nextPage()" [disabled]="page()+1>=totalPages()" class="btn btn-secondary">Next</button>
      </div>
    </div>
  `,
  styles: [``]
})
export class UserMoviesListComponent {
  private readonly moviesApi = inject(MovieService);

  query = '';
  movies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(12);
  totalPages = signal(1);

  constructor() { this.load(); }

  load() {
    this.moviesApi.getAll(this.page(), this.size()).subscribe((p) => {
      this.movies.set(p.content);
      this.totalPages.set(p.totalPages || 1);
    });
  }
  search() { if (!this.query) return this.load(); this.moviesApi.searchDb(this.query).subscribe((res) => this.movies.set(res)); }
  clearSearch() { this.query = ''; this.load(); }
  nextPage() { this.page.set(this.page()+1); this.load(); }
  prevPage() { this.page.set(Math.max(0, this.page()-1)); this.load(); }
}


