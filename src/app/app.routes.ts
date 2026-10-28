import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './features/products/product-catalog/product-catalog.component';
import { ProductFormComponent } from './features/admin/product-form/product-form.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    component: ProductCatalogComponent,
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'admin/products/create',
    component: ProductFormComponent,
  },
  {
    path: 'admin/products/new',
    redirectTo: 'admin/products/create',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
