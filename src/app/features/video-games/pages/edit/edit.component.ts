import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { VideoGameService } from '../../../../core/services/video-game.service';
import { UpdateVideoGameVm, VideoGame } from '../../models/video-game.model';

interface EditState {
  game: VideoGame | null;
  loading: boolean;
  error: string;
  success: string;
  submitting: boolean;
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  gameForm!: FormGroup;
  editState$!: Observable<EditState>;
  
  genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Fighting', 'Action-Adventure', 'Action RPG'];
  platforms = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Multi-platform', 'Mobile'];

  constructor(
    private fb: FormBuilder,
    private videoGameService: VideoGameService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.editState$ = this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          const gameId = +params['id'];
          return this.loadGame(gameId);
        }
        return of(this.createInitialState());
      })
    );
  }

  private initializeForm(): void {
    this.gameForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      publisher: ['', Validators.maxLength(100)],
      releaseDate: [''],
      genre: [''],
      rating: ['', [Validators.min(0), Validators.max(10)]],
      description: ['', Validators.maxLength(1000)],
      platform: [''],
      price: ['', [Validators.min(0)]]
    });
  }

  private loadGame(id: number): Observable<EditState> {
    return this.videoGameService.getById(id).pipe(
      tap(game => this.populateForm(game)),
      map(game => ({
        game,
        loading: false,
        error: '',
        success: '',
        submitting: false
      })),
      catchError(err => {
        console.error('Error loading game:', err);
        return of({
          game: null,
          loading: false,
          error: 'Failed to load game. Please try again.',
          success: '',
          submitting: false
        });
      })
    );
  }

  private populateForm(game: VideoGame): void {
    this.gameForm.patchValue({
      title: game.title,
      publisher: game.publisher,
      releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
      genre: game.genre,
      rating: game.rating,
      description: game.description,
      platform: game.platform,
      price: game.price
    });
  }

  private createInitialState(): EditState {
    return {
      game: null,
      loading: false,
      error: '',
      success: '',
      submitting: false
    };
  }

  onSubmit(): void {
    if (this.gameForm.invalid) {
      this.markFormGroupTouched(this.gameForm);
      return;
    }

    const gameData = this.buildGameData();

    this.videoGameService.update(gameData).subscribe({
      next: () => {
        setTimeout(() => this.router.navigate(['/browser']), 1500);
      },
      error: (err) => {
        console.error('Error updating game:', err);
      }
    });
  }

  private buildGameData(): UpdateVideoGameVm {
    const formValue = this.gameForm.value;
    return {
      id: this.getGameId(),
      title: formValue.title.trim(),
      publisher: formValue.publisher?.trim() || undefined,
      releaseDate: formValue.releaseDate ? new Date(formValue.releaseDate) : new Date(),
      genre: formValue.genre || undefined,
      rating: formValue.rating !== null && formValue.rating !== '' ? +formValue.rating : undefined,
      description: formValue.description?.trim() || undefined,
      platform: formValue.platform || undefined,
      price: formValue.price !== null && formValue.price !== '' ? +formValue.price : undefined
    };
  }

  private getGameId(): number {
    const id = this.route.snapshot.params['id'];
    return id ? +id : 0;
  }

  onCancel(): void {
    this.router.navigate(['/browser']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.gameForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.gameForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than or equal to 0';
    }
    if (field?.hasError('max')) {
      return 'Value must be less than or equal to 10';
    }
    return '';
  }
}