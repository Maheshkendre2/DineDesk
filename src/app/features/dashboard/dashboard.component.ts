import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

interface SummaryCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  loading = false;
  summaryCards: SummaryCard[] = [];
  recentOrders: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Mock data - replace with actual API calls
    this.summaryCards = [
      {
        title: 'Total Orders',
        value: '142',
        icon: '📋',
        color: '#667eea',
        trend: 12
      },
      {
        title: 'Total Revenue',
        icon: '💰',
        value: '₹45,230',
        color: '#10b981',
        trend: 8
      },
      {
        title: 'Tables Occupied',
        value: '8/12',
        icon: '🪑',
        color: '#f59e0b',
        trend: -5
      },
      {
        title: 'Pending Orders',
        value: '5',
        icon: '⏳',
        color: '#ef4444',
        trend: 2
      }
    ];

    this.recentOrders = [
      {
        id: '#ORD001',
        table: 'Table 3',
        items: 'Paneer Tikka × 2, Butter Chicken × 1',
        amount: '₹890',
        status: 'preparing',
        time: '10 min ago'
      },
      {
        id: '#ORD002',
        table: 'Table 5',
        items: 'Mango Lassi × 3',
        amount: '₹240',
        status: 'served',
        time: '15 min ago'
      },
      {
        id: '#ORD003',
        table: 'Table 1',
        items: 'Gulab Jamun × 4',
        amount: '₹600',
        status: 'ready',
        time: '5 min ago'
      },
      {
        id: '#ORD004',
        table: 'Table 7',
        items: 'Paneer Tikka × 1, Naan × 2',
        amount: '₹450',
        status: 'pending',
        time: '2 min ago'
      }
    ];

    this.loading = false;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getTrendClass(trend: number | undefined): string {
    if (!trend) return '';
    return trend > 0 ? 'trend-up' : 'trend-down';
  }
}
