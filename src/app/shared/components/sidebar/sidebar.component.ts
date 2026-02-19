import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currentUser$!: Observable<User | null>;
  isOpen = true;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊', roles: ['admin', 'waiter', 'chef', 'cashier'] },
    { label: 'Menu', route: '/menu', icon: '🍽️', roles: ['admin'] },
    { label: 'Orders', route: '/orders', icon: '📋', roles: ['admin', 'waiter'] },
    { label: 'Tables', route: '/tables', icon: '🪑', roles: ['admin', 'waiter'] },
    { label: 'Kitchen', route: '/kitchen', icon: '👨‍🍳', roles: ['chef'] },
    { label: 'Billing', route: '/billing', icon: '💰', roles: ['admin', 'cashier'] }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  getVisibleMenuItems(role: string): MenuItem[] {
    return this.menuItems.filter(item => item.roles.includes(role));
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
