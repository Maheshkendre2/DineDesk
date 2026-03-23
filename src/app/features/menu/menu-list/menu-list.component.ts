import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem, MenuCategory } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuListComponent implements OnInit {
  menuItems$: Observable<MenuItem[]>;
  categories$: Observable<MenuCategory[]>;
  searchTerm = '';
  selectedCategory = '';
  sortBy: 'name' | 'price' | 'time' = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;

  constructor(private menuService: MenuService) {
    this.menuItems$ = this.menuService.menuItems$;
    this.categories$ = this.menuService.getCategories();
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  /**
   * Load all menu items
   */
  loadMenuItems(): void {
    this.isLoading = true;
    this.menuService.getMenuItems().subscribe({
      next: () => (this.isLoading = false),
      error: (err) => {
        console.error('Error loading menu items:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle search input - triggers RxJS search pipeline with debounce
   */
  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm = term;
    this.menuService.searchMenuItems(term);
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.menuService.searchMenuItems('');
  }

  /**
   * Filter by category
   */
  filterByCategory(event: Event): void {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategory = categoryId;
    if (categoryId) {
      this.menuItems$ = this.menuService.getItemsByCategory(categoryId);
    } else {
      this.menuItems$ = this.menuService.menuItems$;
    }
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Change sort order
   */
  changeSortBy(event: Event): void {
    const sortOption = (event.target as HTMLSelectElement).value as 'name' | 'price' | 'time';
    this.sortBy = sortOption;
  }

  /**
   * Format currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  /**
   * Get preparation time label
   */
  getTimeLabel(minutes: number): string {
    return `${minutes} min`;
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByItemId(_: number, item: MenuItem): string {
    return item.id;
  }

  /**
   * Track by function for categories in ngFor
   */
  trackByCategoryId(_: number, category: MenuCategory): string {
    return category.id;
  }

  /**
   * Delete menu item
   */
  deleteItem(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.deleteMenuItem(id).subscribe({
        next: () => console.log('Item deleted'),
        error: (err) => console.error('Error deleting item:', err)
      });
    }
  }
}
