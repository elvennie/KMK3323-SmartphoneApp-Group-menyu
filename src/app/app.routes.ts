import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full',
  },
  {
    path: 'customer',
    loadComponent: () => import('./customer/customer.page').then(m => m.CustomerPage)
  },
  {
    path: 'vendor',
    loadComponent: () => import('./vendor/vendor.page').then(m => m.VendorPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.page').then(m => m.CartPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.page').then(m => m.OrdersPage)
  },
  {
    path: 'payment', 
    loadComponent: () => import('./payment/payment.page').then(m => m.PaymentPage)
  },
  {
    path: 'add-menu',
    loadComponent: () => import('./add-menu/add-menu.page').then(m => m.AddMenuPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  }
];