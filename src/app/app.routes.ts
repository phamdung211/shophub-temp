import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { checkoutGuard } from './core/guards/checkout.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-catalog/product-catalog.component').then(
        (m) => m.ProductCatalogComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'admin/products/create',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/admin/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'admin/products/new',
    redirectTo: 'admin/products/create',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'checkout',
    canActivate: [authGuard, checkoutGuard], // Bảo vệ: Phải đăng nhập VÀ Giỏ hàng có đồ
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'order-success/:orderId',
    loadComponent: () =>
      import('./features/checkout/order-success/order-success.component').then(
        (m) => m.OrderSuccessComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/order-history.component').then(
        (m) => m.OrderHistoryComponent
      ),
  },
  {
    path: 'admin/products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-products/admin-products.component').then(
        (m) => m.AdminProductsComponent
      ),
  },
  {
    path: 'admin/products/edit/:id',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/admin/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
