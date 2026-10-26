import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './features/products/product-catalog/product-catalog.component';
import { ProductFormComponent } from './features/admin/product-form/product-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductCatalogComponent,
  },
  {
    path: 'admin/products/new',
    component: ProductFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
