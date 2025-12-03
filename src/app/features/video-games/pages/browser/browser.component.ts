import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoGameService } from '../../../../core/services/video-game.service';
import { PaginatedResult, VideoGame } from '../../models/video-game.model';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, of, startWith, switchMap, tap } from 'rxjs';

interface GameState {
  games: VideoGame[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  error: string;
}

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  
  gameState$!: Observable<GameState>;
  
  searchTerm = '';
  sortBy = 'title';
  sortDescending = false;
  pageSize = 10;
  currentPage = 1;

  pageSizes = [5, 10, 20, 50];
  sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'publisher', label: 'Publisher' },
    { value: 'releaseDate', label: 'Release Date' },
    { value: 'rating', label: 'Rating' },
    { value: 'price', label: 'Price' }
  ];

  constructor(private videoGameService: VideoGameService) {}

  ngOnInit(): void {
    this.gameState$ = this.refreshTrigger$.pipe(
      switchMap(() => this.loadGames()),
      startWith(this.createLoadingState())
    );
  }

  private loadGames(): Observable<GameState> {
    return this.videoGameService.getVideoGames(
      this.currentPage,
      this.pageSize,
      this.searchTerm || undefined,
      this.sortBy,
      this.sortDescending
    ).pipe(
      map(result => this.mapToSuccessState(result)),
      catchError(err => this.handleError(err))
    );
  }

  private mapToSuccessState(result: PaginatedResult<VideoGame>): GameState {
    return {
      games: result.items,
      currentPage: result.pageIndex,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
      loading: false,
      error: ''
    };
  }

  private handleError(err: any): Observable<GameState> {
    console.error('Error loading games:', err);
    return of({
      games: [],
      currentPage: this.currentPage,
      totalPages: 0,
      totalCount: 0,
      loading: false,
      error: 'Failed to load games. Please try again.'
    });
  }

  private createLoadingState(): GameState {
    return {
      games: [],
      currentPage: this.currentPage,
      totalPages: 0,
      totalCount: 0,
      loading: true,
      error: ''
    };
  }

  private refresh(): void {
    this.refreshTrigger$.next();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.refresh();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.refresh();
  }

  toggleSortDirection(): void {
    this.sortDescending = !this.sortDescending;
    this.refresh();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.refresh();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.refresh();
  }

  getPageNumbers(totalPages: number, currentPage: number): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return 'N/A';
    return `$${price.toFixed(2)}`;
  }
}