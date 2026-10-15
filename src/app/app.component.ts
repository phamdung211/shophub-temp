import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  products = [
    {
      id: 1,
      name: 'Laptop ASUS',
      price: 20000000,
      imageUrl: 'https://placehold.co/600x400?text=Laptop',
      inStock: true,
    },
    {
      id: 2,
      name: 'Tai nghe không dây',
      price: 1200000,
      imageUrl: 'https://placehold.co/600x400?text=Headphones',
      inStock: true,
    },
    {
      id: 3,
      name: 'Bàn phím cơ',
      price: 850000,
      imageUrl: 'https://placehold.co/600x400?text=Keyboard',
      inStock: false,
    },
  ];
}
