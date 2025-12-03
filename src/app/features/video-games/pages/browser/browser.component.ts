import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoGameService } from '../../../../core/services/video-game.service';
import { VideoGame } from '../../models/video-game.model';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {
  games: VideoGame[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;
  searchTerm = '';
  sortBy = 'title';
  sortDescending = false;
  loading = false;
  error = '';

  pageSizes = [5, 10, 20, 50];
  sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'publisher', label: 'Publisher' },
    { value: 'releaseDate', label: 'Release Date' },
    { value: 'rating', label: 'Rating' },
    { value: 'price', label: 'Price' }
  ];

   constructor(private videoGameService: VideoGameService, 
    private change: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading = true;
    this.error = '';

    this.videoGameService.getVideoGames(
      this.currentPage,
      this.pageSize,
      this.searchTerm || undefined,
      this.sortBy,
      this.sortDescending
    ).subscribe({
      next: (result) => {
        this.games = result.items;
        this.currentPage = result.pageIndex;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
        this.loading = false;
        this.change.detectChanges()
      },
      error: (err) => {
        this.error = 'Failed to load games. Please try again.';
        this.loading = false;
        console.error('Error loading games:', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadGames();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadGames();
  }

  toggleSortDirection(): void {
    this.sortDescending = !this.sortDescending;
    this.loadGames();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadGames();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGames();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

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