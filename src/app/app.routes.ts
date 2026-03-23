import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import { MenuFormComponent } from './features/menu/menu-form/menu-form.component';
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { TableListComponent } from './features/tables/table-list/table-list.component';
import { KitchenBoardComponent } from './features/kitchen/kitchen-board/kitchen-board.component';
import { BillingComponent } from './features/billing/billing.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    component: DashboardComponent
  },
  {
    path: 'menu',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    component: MenuListComponent
  },
  {
    path: 'menu/add',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    component: MenuFormComponent
  },
  {
    path: 'menu/edit/:id',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    component: MenuFormComponent
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'waiter'] },
    component: OrderListComponent
  },
  {
    path: 'tables',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'waiter'] },
    component: TableListComponent
  },
  {
    path: 'kitchen',
    canActivate: [AuthGuard],
    data: { roles: ['chef'] },
    component: KitchenBoardComponent
  },
  {
    path: 'billing',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'cashier'] },
    component: BillingComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
