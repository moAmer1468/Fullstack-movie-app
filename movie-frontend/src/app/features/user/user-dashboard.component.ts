import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/movie.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toolbar">
      <input placeholder="Search in app" [(ngModel)]="query" />
      <button (click)="search()">Search</button>
    </div>
    <div class="grid">
      <a class="card" *ngFor="let m of movies()" [routerLink]="['/movies', m.id]">
        <img [src]="m.poster || ''" alt="poster" />
        <div class="meta">
          <div class="title">{{ m.title }} ({{ m.year }})</div>
        </div>
      </a>
    </div>
    <div class="pagination">
      <button (click)="prevPage()" [disabled]="page()===0">Prev</button>
      <span>Page {{ page()+1 }} / {{ totalPages() }}</span>
      <button (click)="nextPage()" [disabled]="page()+1>=totalPages()">Next</button>
    </div>
  `,
  styles: [
    `.toolbar{display:flex;gap:8px;align-items:center;margin:16px 0}`,
    `.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}`,
    `.card{border:1px solid #ddd;border-radius:8px;overflow:hidden;padding:8px;display:flex;gap:8px;text-decoration:none;color:inherit}`,
    `.card img{width:80px;height:120px;object-fit:cover;border-radius:4px;background:#eee}`,
    `.meta{display:flex;flex-direction:column;gap:8px}`,
    `.title{font-weight:600}`,
    `.pagination{display:flex;gap:12px;justify-content:center;margin:16px 0}`
  ]
})
export class UserDashboardComponent {
  private readonly moviesApi = inject(MovieService);

  query = '';
  movies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(12);
  totalPages = signal(1);

  constructor() {
    this.load();
  }

  load() {
    this.moviesApi.getAll(this.page(), this.size()).subscribe((p) => {
      this.movies.set(p.content);
      this.totalPages.set(p.totalPages || 1);
    });
  }

  search() {
    if (!this.query) return this.load();
    this.moviesApi.searchDb(this.query).subscribe((res) => this.movies.set(res));
  }

  nextPage() { this.page.set(this.page()+1); this.load(); }
  prevPage() { this.page.set(Math.max(0, this.page()-1)); this.load(); }
}



