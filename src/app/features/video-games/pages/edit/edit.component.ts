import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoGameService } from '../../../../core/services/video-game.service';
import { UpdateVideoGameVm, VideoGame } from '../../models/video-game.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  gameForm!: FormGroup;
  gameId: number | null = null;
  isEditMode = false;
  loading = false;
  error = '';
  success = '';

  genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Fighting', 'Action-Adventure', 'Action RPG'];
  platforms = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Multi-platform', 'Mobile'];

  constructor(
    private fb: FormBuilder,
    private videoGameService: VideoGameService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.gameId = +params['id'];
        this.loadGame(this.gameId);
      }
    });
  }

  initializeForm(): void {
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

  loadGame(id: number): void {
    this.loading = true;
    this.videoGameService.getById(id).subscribe({
      next: (game: VideoGame) => {
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
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load game. Please try again.';
        this.loading = false;
        console.error('Error loading game:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.gameForm.invalid) {
      this.markFormGroupTouched(this.gameForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formValue = this.gameForm.value;
    const gameData: UpdateVideoGameVm = {
      id: this.gameId || 0, 
      title: formValue.title.trim(),
      publisher: formValue.publisher?.trim() || undefined,
      releaseDate: formValue.releaseDate ? new Date(formValue.releaseDate) : new Date(),
      genre: formValue.genre || undefined,
      rating: formValue.rating !== null && formValue.rating !== '' ? +formValue.rating : undefined,
      description: formValue.description?.trim() || undefined,
      platform: formValue.platform || undefined,
      price: formValue.price !== null && formValue.price !== '' ? +formValue.price : undefined
    };

    this.videoGameService.update(gameData).subscribe({
      next: () => {
        this.success = 'Game updated successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/browser']), 1500);
      },
      error: (err) => {
        this.error = 'Failed to update game. Please try again.';
        this.loading = false;
        console.error('Error updating game:', err);
      }
    });
   
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