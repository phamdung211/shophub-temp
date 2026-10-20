import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import type { Product } from './core/model/product.model';
import { ProductCatalogComponent } from './features/products/product-catalog/product-catalog.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductCatalogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // products: Product[] = [
  //   {
  //     id: 1,
  //     title: 'Laptop ASUS',
  //     description: 'Laptop phục vụ học tập và làm việc',
  //     price: 2000000,
  //     discountPercentage: 15,
  //     rating: 4.8,
  //     stock: 10,
  //     brand: 'ASUS',
  //     category: 'laptops',
  //     thumbnail: 'https://placehold.co/600x400?text=Laptop',
  //     images: ['https://placehold.co/600x400?text=Laptop'],
  //   },
  //   {
  //     id: 2,
  //     title: 'Tai nghe không dây',
  //     description: 'Tai nghe không dây phục vụ giải trí',
  //     price: 1200000,
  //     discountPercentage: 5,
  //     rating: 4.5,
  //     stock: 20,
  //     brand: 'Sony',
  //     category: 'accessories',
  //     thumbnail: 'https://placehold.co/600x400?text=Headphones',
  //     images: ['https://placehold.co/600x400?text=Headphones'],
  //   },
  //   {
  //     id: 3,
  //     title: 'Bàn phím cơ',
  //     description: 'Bàn phím cơ dành cho chơi game và làm việc',
  //     price: 850000,
  //     discountPercentage: 20,
  //     rating: 4.6,
  //     stock: 0,
  //     brand: 'Logitech',
  //     category: 'accessories',
  //     thumbnail: 'https://placehold.co/600x400?text=Keyboard',
  //     images: ['https://placehold.co/600x400?text=Keyboard'],
  //   },
  // ];
}
