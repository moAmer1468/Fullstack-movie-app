import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie, MovieService } from '../../core/movie.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <input placeholder="Search OMDB" [(ngModel)]="query" />
      <button (click)="searchOmdb()">Search</button>
      <button (click)="fetchAndSave()" [disabled]="!query">Fetch & Save</button>
    </div>

    <div class="error" *ngIf="error()">{{ error() }}</div>

    <div class="grid" *ngIf="omdbResults().length">
      <div class="card" *ngFor="let m of omdbResults()">
        <img [src]="m.poster || ''" alt="poster" />
        <div class="meta">
          <div class="title">{{ m.title }} ({{ m.year }})</div>
          <button (click)="add(m)">Add</button>
        </div>
      </div>
    </div>

    <h3>Database Movies</h3>
    <div class="toolbar">
      <button (click)="deleteSelected()" [disabled]="!selectedIds().length">Delete Selected</button>
    </div>
    <div class="grid">
      <div class="card" *ngFor="let m of dbMovies()">
        <input type="checkbox" [checked]="selectedIds().includes(m.id!)" (change)="toggleSelect(m.id!)" />
        <img [src]="m.poster || ''" alt="poster" />
        <div class="meta">
          <div class="title">{{ m.title }} ({{ m.year }})</div>
          <button (click)="remove(m.id!)">Remove</button>
        </div>
      </div>
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
    `.card{border:1px solid #ddd;border-radius:8px;overflow:hidden;padding:8px;display:flex;gap:8px}`,
    `.card img{width:80px;height:120px;object-fit:cover;border-radius:4px;background:#eee}`,
    `.meta{display:flex;flex-direction:column;gap:8px}`,
    `.title{font-weight:600}`,
    `.pagination{display:flex;gap:12px;justify-content:center;margin:16px 0}`,
    `.error{color:#b00020;margin:8px 0}`
  ]
})
export class AdminDashboardComponent {
  private readonly movies = inject(MovieService);

  query = '';
  omdbResults = signal<Movie[]>([]);
  dbMovies = signal<Movie[]>([]);
  page = signal(0);
  size = signal(8);
  totalPages = signal(1);
  selectedIds = signal<number[]>([]);
  error = signal<string | null>(null);

  constructor() {
    this.loadDb();
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
}



