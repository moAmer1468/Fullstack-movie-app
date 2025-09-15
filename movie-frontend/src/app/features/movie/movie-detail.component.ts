import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie, MovieService } from '../../core/movie.service';
import { RatingService } from '../../core/rating.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="movie() as m" class="detail">
      <img [src]="m.poster || ''" alt="poster" />
      <div class="info">
        <h2>{{ m.title }} ({{ m.year }})</h2>
        <p>{{ m.plot }}</p>
        <div class="rating">
          <span>Average rating: {{ average() | number:'1.1-1' }}</span>
          <div>
            <label>Rate:</label>
            <select [(ngModel)]="myRating">
              <option *ngFor="let r of ratings" [value]="r">{{ r }}</option>
            </select>
            <button (click)="rate()">Submit</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.detail{display:flex;gap:16px;margin:16px}`,
    `.detail img{width:200px;height:300px;object-fit:cover;border-radius:8px;background:#eee}`,
    `.info{display:flex;flex-direction:column;gap:12px}`,
    `.rating{display:flex;gap:12px;align-items:center}`
  ]
})
export class MovieDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly movies = inject(MovieService);
  private readonly ratingsApi = inject(RatingService);

  movie = signal<Movie | null>(null);
  average = signal(0);
  ratings = [1,2,3,4,5];
  myRating = 5;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.movies.getById(id).subscribe((m) => this.movie.set(m));
      this.loadAverage(id);
    }
  }

  loadAverage(id: number) {
    this.ratingsApi.average(id).subscribe((avg) => this.average.set(avg || 0));
  }

  rate() {
    const id = this.movie()?.id;
    if (!id) return;
    this.ratingsApi.rate(id, this.myRating).subscribe(() => this.loadAverage(id));
  }
}



