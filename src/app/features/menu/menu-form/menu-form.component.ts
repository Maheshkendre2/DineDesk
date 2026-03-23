import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MenuService } from '../../../core/services/menu.service';
import { MenuCategory, MenuItemRequest } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuFormComponent implements OnInit {
  menuForm!: FormGroup;
  categories$: Observable<MenuCategory[]>;
  isEditMode = false;
  isSubmitting = false;
  submitError: string | null = null;
  itemId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.categories$ = this.menuService.getCategories();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form with validation
   */
  private initializeForm(): void {
    this.menuForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      preparationTime: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      available: [true],
      vegetarian: [false],
      spicy: [false],
      image: ['']
    });
  }

  /**
   * Check if we're in edit mode
   */
  private checkEditMode(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = params['id'];
        this.loadMenuItem(params['id']);
      }
    });
  }

  /**
   * Load existing menu item for editing
   */
  private loadMenuItem(id: string): void {
    this.menuService.getMenuItem(id).subscribe({
      next: (item) => {
        this.menuForm.patchValue({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          preparationTime: item.preparationTime,
          available: item.available,
          vegetarian: item.vegetarian || false,
          spicy: item.spicy || false,
          image: item.image || ''
        });
      },
      error: (err) => {
        console.error('Error loading menu item:', err);
        this.submitError = 'Failed to load menu item. Redirecting...';
        setTimeout(() => this.router.navigate(['/menu']), 2000);
      }
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.menuForm.invalid) {
      Object.keys(this.menuForm.controls).forEach(key => {
        this.menuForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const formData: MenuItemRequest = this.menuForm.value;

    const request = this.isEditMode && this.itemId
      ? this.menuService.updateMenuItem(this.itemId, formData)
      : this.menuService.createMenuItem(formData);

    request.pipe(
      tap(() => {
        const message = this.isEditMode ? 'Item updated successfully!' : 'Item created successfully!';
        console.log(message);
        this.router.navigate(['/menu']);
      })
    ).subscribe({
      next: () => this.isSubmitting = false,
      error: (err) => {
        console.error('Error submitting form:', err);
        this.submitError = 'Failed to save menu item. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    if (this.isEditMode) {
      this.checkEditMode();
    } else {
      this.menuForm.reset({ available: true });
    }
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/menu']);
  }

  /**
   * Get form control for error display
   */
  getControl(name: string) {
    return this.menuForm.get(name);
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorName: string): boolean {
    const field = this.menuForm.get(fieldName);
    return !!(field && field.hasError(errorName) && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.menuForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return `${fieldName} is required`;
    if (field.hasError('minlength')) return `Minimum length is ${field.getError('minlength').requiredLength}`;
    if (field.hasError('maxlength')) return `Maximum length is ${field.getError('maxlength').requiredLength}`;
    if (field.hasError('min')) return `Value must be at least ${field.getError('min').min}`;
    if (field.hasError('max')) return `Value cannot exceed ${field.getError('max').max}`;

    return 'Invalid value';
  }
}
