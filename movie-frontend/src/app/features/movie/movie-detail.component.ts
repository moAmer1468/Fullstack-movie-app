import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie, MovieService } from '../../core/movie.service';
import { RatingService } from '../../core/rating.service';
import { Review, ReviewService } from '../../core/review.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="movie-detail-container">
      <div *ngIf="movie() as m" class="movie-detail">
        <div class="movie-poster-section">
          <img [src]="m.posterUrl || '/assets/no-poster.png'" alt="poster" class="movie-poster" width="300" height="450" />
        </div>
        
        <div class="movie-info-section">
          <div class="movie-header">
            <h1>{{ m.title }}</h1>
            <span class="movie-year">({{ m.year }})</span>
          </div>
          
          <div class="movie-details">
            <div class="detail-item" *ngIf="m.type">
              <span class="label">Type:</span>
              <span class="value">{{ m.type }}</span>
            </div>
            <div class="detail-item" *ngIf="m.genre">
              <span class="label">Genre:</span>
              <span class="value">{{ m.genre }}</span>
            </div>
            <div class="detail-item" *ngIf="m.director">
              <span class="label">Director:</span>
              <span class="value">{{ m.director }}</span>
            </div>
            <div class="detail-item" *ngIf="m.actors">
              <span class="label">Actors:</span>
              <span class="value">{{ m.actors }}</span>
            </div>
            <div class="detail-item" *ngIf="m.imdbId">
              <span class="label">IMDb ID:</span>
              <span class="value">{{ m.imdbId }}</span>
            </div>
          </div>
          
          <div class="movie-plot" *ngIf="m.plot">
            <h3>Plot</h3>
            <p>{{ m.plot }}</p>
          </div>
          
          <div class="rating-section">
            <div class="average-rating">
              <h3>Average Rating</h3>
              <div class="rating-display">
                <span class="rating-stars">{{ getStars(average()) }}</span>
                <span class="rating-value">{{ average() | number:'1.1-1' }}/5</span>
              </div>
            </div>
            
            <div class="user-rating">
              <h3>Rate This Movie</h3>
              <div class="rating-controls">
                <select [(ngModel)]="myRating" class="rating-select">
                  <option *ngFor="let r of ratings" [value]="r">{{ r }} Star{{ r !== 1 ? 's' : '' }}</option>
                </select>
                <button (click)="rate()" class="btn btn-primary">Submit Rating</button>
              </div>
            </div>
          </div>
          
          <!-- Reviews Section -->          
          <div class="reviews-section">
            <h3>Reviews</h3>
            
            <!-- Add Review Form -->
            <div class="add-review-form">
              <h4>Add Your Review</h4>
              <textarea 
                [(ngModel)]="reviewContent" 
                placeholder="Share your thoughts about this movie..."
                class="review-textarea"
                rows="4"
              ></textarea>
              <button 
                (click)="addReview()" 
                class="btn btn-primary"
                [disabled]="!reviewContent.trim()"
              >Submit Review</button>
            </div>
            
            <!-- Reviews List -->
            <div class="reviews-list">
              <div *ngIf="reviews().length === 0" class="no-reviews">
                <p>No reviews yet. Be the first to review!</p>
              </div>
              
              <div *ngFor="let review of reviews()" class="review-card">
                <div class="review-header">
                  <span class="review-author">{{ review.username }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </div>
                <div class="review-content">
                  <p>{{ review.content }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="movie-actions">
            <button (click)="goBack()" class="btn btn-secondary">Back to Movies</button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!movie()" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .movie-detail {
      background: var(--surface);
      border-radius: 16px;
      padding: 30px;
      box-shadow: var(--shadow);
      display: flex;
      gap: 30px;
    }
    
    .movie-poster-section {
      flex-shrink: 0;
    }
    
    .movie-poster {
      width: 300px;
      height: 450px;
      object-fit: cover;
      border-radius: 12px;
      background: var(--surface-2);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    .movie-info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .movie-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .movie-header h1 {
      color: #fff;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
    }
    
    .movie-year {
      color: var(--muted);
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .movie-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .detail-item {
      display: flex;
      gap: 12px;
    }
    
    .label {
      color: var(--muted);
      font-weight: 500;
      min-width: 100px;
    }
    
    .value {
      color: var(--text);
      font-weight: 600;
    }
    
    .movie-plot h3 {
      color: var(--accent);
      font-size: 1.3rem;
      margin: 0 0 12px 0;
    }
    
    .movie-plot p {
      color: var(--text);
      line-height: 1.6;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .rating-section {
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }
    
    .average-rating, .user-rating {
      flex: 1;
      min-width: 250px;
    }
    
    .average-rating h3, .user-rating h3 {
      color: var(--accent);
      font-size: 1.3rem;
      margin: 0 0 16px 0;
    }
    
    .rating-display {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .rating-stars {
      font-size: 1.5rem;
      color: #fbbf24;
    }
    
    .rating-value {
      color: var(--text);
      font-size: 1.2rem;
      font-weight: 600;
    }
    
    .rating-controls {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .rating-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      background: var(--surface-2);
      color: var(--text);
      font-size: 1rem;
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
    
    .movie-actions {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid var(--card-border);
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--muted);
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--surface-2);
      border-top: 4px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Reviews Section Styles */
    .reviews-section {
      margin-top: 30px;
      border-top: 1px solid var(--card-border);
      padding-top: 24px;
    }
    
    .reviews-section h3 {
      color: var(--accent);
      font-size: 1.3rem;
      margin: 0 0 20px 0;
    }
    
    .add-review-form {
      background: var(--surface-2);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .add-review-form h4 {
      color: var(--text);
      font-size: 1.1rem;
      margin: 0 0 12px 0;
    }
    
    .review-textarea {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      background: var(--surface);
      color: var(--text);
      font-size: 1rem;
      resize: vertical;
      margin-bottom: 16px;
    }
    
    .review-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
    }
    
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-reviews {
      color: var(--muted);
      font-style: italic;
      text-align: center;
      padding: 20px;
    }
    
    .review-card {
      background: var(--surface-2);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid var(--card-border);
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .review-author {
      color: var(--accent);
      font-weight: 600;
    }
    
    .review-date {
      color: var(--muted);
      font-size: 0.9rem;
    }
    
    .review-content p {
      color: var(--text);
      margin: 0;
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .movie-detail {
        flex-direction: column;
        padding: 20px;
      }
      
      .movie-poster {
        width: 100%;
        max-width: 300px;
        height: auto;
        aspect-ratio: 2/3;
        margin: 0 auto;
      }
      
      .movie-header h1 {
        font-size: 2rem;
      }
      
      .rating-section {
        flex-direction: column;
        gap: 24px;
      }
      
      .rating-controls {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class MovieDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movies = inject(MovieService);
  private readonly ratingsApi = inject(RatingService);
  private readonly reviewsApi = inject(ReviewService);

  movie = signal<Movie | null>(null);
  average = signal(0);
  ratings = [1,2,3,4,5];
  myRating = 5;
  reviews = signal<Review[]>([]);
  reviewContent = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.movies.getById(id).subscribe((m) => this.movie.set(m));
      this.loadAverage(id);
      this.loadReviews(id);
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

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  loadReviews(id: number) {
    this.reviewsApi.getMovieReviews(id).subscribe((reviews) => this.reviews.set(reviews));
  }

  addReview() {
    const id = this.movie()?.id;
    if (!id || !this.reviewContent.trim()) return;
    
    const review: Review = {
      movieId: id,
      content: this.reviewContent.trim()
    };
    
    this.reviewsApi.addReview(review).subscribe((newReview) => {
      this.reviews.update(reviews => [newReview, ...reviews]);
      this.reviewContent = ''; // Clear the input after submission
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }
}



