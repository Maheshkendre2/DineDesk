import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, delay } from 'rxjs/operators';
import { MenuItem, MenuCategory, MenuItemRequest } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private mockCategories: MenuCategory[] = [
    { id: '1', name: 'Appetizers', description: 'Start your meal', icon: '🥗' },
    { id: '2', name: 'Main Courses', description: 'Delicious entrees', icon: '🍽️' },
    { id: '3', name: 'Desserts', description: 'Sweet treats', icon: '🍰' },
    { id: '4', name: 'Beverages', description: 'Drinks', icon: '🥤' }
  ];

  private mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Caesar Salad',
      description: 'Fresh romaine with parmesan and croutons',
      price: 8.99,
      category: '1',
      categoryName: 'Appetizers',
      available: true,
      preparationTime: 5,
      vegetarian: true
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter sauce',
      price: 22.99,
      category: '2',
      categoryName: 'Main Courses',
      available: true,
      preparationTime: 15
    },
    {
      id: '3',
      name: 'Spicy Chicken Tikka',
      description: 'Marinated in yogurt and spices',
      price: 16.99,
      category: '2',
      categoryName: 'Main Courses',
      available: true,
      preparationTime: 12,
      spicy: true
    },
    {
      id: '4',
      name: 'Vegetarian Pasta',
      description: 'Seasonal vegetables with fresh basil',
      price: 13.99,
      category: '2',
      categoryName: 'Main Courses',
      available: true,
      preparationTime: 10,
      vegetarian: true
    },
    {
      id: '5',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 7.99,
      category: '3',
      categoryName: 'Desserts',
      available: true,
      preparationTime: 8,
      vegetarian: true
    },
    {
      id: '6',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed',
      price: 4.99,
      category: '4',
      categoryName: 'Beverages',
      available: true,
      preparationTime: 2,
      vegetarian: true
    },
    {
      id: '7',
      name: 'Garlic Bread',
      description: 'Crispy bread with garlic butter',
      price: 5.99,
      category: '1',
      categoryName: 'Appetizers',
      available: true,
      preparationTime: 4,
      vegetarian: true
    },
    {
      id: '8',
      name: 'Ribeye Steak',
      description: 'Premium cut grilled to perfection',
      price: 28.99,
      category: '2',
      categoryName: 'Main Courses',
      available: true,
      preparationTime: 18
    }
  ];

  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.mockMenuItems);
  private searchTermSubject = new BehaviorSubject<string>('');

  // Observable for menu items with search functionality
  menuItems$ = this.searchTermSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(searchTerm => this.filterMenuItems(searchTerm)),
    map(items => items.sort((a, b) => a.name.localeCompare(b.name)))
  );

  // Observable for categories
  categories$: Observable<MenuCategory[]> = of(this.mockCategories);

  constructor() {}

  /**
   * Get all menu items
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItemsSubject.asObservable().pipe(
      delay(300) // Simulate network delay
    );
  }

  /**
   * Get menu item by ID
   */
  getMenuItem(id: string): Observable<MenuItem> {
    const item = this.mockMenuItems.find(m => m.id === id);
    if (item) {
      return of(item).pipe(delay(200));
    }
    return throwError(() => new Error('Menu item not found'));
  }

  /**
   * Get categories
   */
  getCategories(): Observable<MenuCategory[]> {
    return this.categories$.pipe(delay(300));
  }

  /**
   * Create new menu item
   */
  createMenuItem(item: MenuItemRequest): Observable<MenuItem> {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      ...item,
      categoryName: this.mockCategories.find(c => c.id === item.category)?.name || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockMenuItems.push(newItem);
    this.menuItemsSubject.next([...this.mockMenuItems]);
    return of(newItem).pipe(delay(500));
  }

  /**
   * Update menu item
   */
  updateMenuItem(id: string, item: MenuItemRequest): Observable<MenuItem> {
    const index = this.mockMenuItems.findIndex(m => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    const updated: MenuItem = {
      ...this.mockMenuItems[index],
      ...item,
      id,
      categoryName: this.mockCategories.find(c => c.id === item.category)?.name || '',
      updatedAt: new Date()
    };

    this.mockMenuItems[index] = updated;
    this.menuItemsSubject.next([...this.mockMenuItems]);
    return of(updated).pipe(delay(500));
  }

  /**
   * Delete menu item
   */
  deleteMenuItem(id: string): Observable<void> {
    const index = this.mockMenuItems.findIndex(m => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    this.mockMenuItems.splice(index, 1);
    this.menuItemsSubject.next([...this.mockMenuItems]);
    return of(void 0).pipe(delay(500));
  }

  /**
   * Search menu items by name or description
   */
  searchMenuItems(term: string): void {
    this.searchTermSubject.next(term);
  }

  /**
   * Private method for filtering menu items
   */
  private filterMenuItems(searchTerm: string): Observable<MenuItem[]> {
    if (!searchTerm.trim()) {
      return of(this.mockMenuItems);
    }

    const filtered = this.mockMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered).pipe(delay(150));
  }

  /**
   * Get items by category
   */
  getItemsByCategory(categoryId: string): Observable<MenuItem[]> {
    const filtered = this.mockMenuItems.filter(item => item.category === categoryId);
    return of(filtered).pipe(delay(300));
  }

  /**
   * Get available items
   */
  getAvailableItems(): Observable<MenuItem[]> {
    const available = this.mockMenuItems.filter(item => item.available);
    return of(available).pipe(delay(300));
  }

  /**
   * Get vegetarian items
   */
  getVegetarianItems(): Observable<MenuItem[]> {
    const vegetarian = this.mockMenuItems.filter(item => item.vegetarian);
    return of(vegetarian).pipe(delay(300));
  }

  /**
   * Get spicy items
   */
  getSpicyItems(): Observable<MenuItem[]> {
    const spicy = this.mockMenuItems.filter(item => item.spicy);
    return of(spicy).pipe(delay(300));
  }
}
