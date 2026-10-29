import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../../shared/pipes/discount-calculator.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { RelatedProductsComponent } from './components/related-products/related-products.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    VndCurrencyPipe,
    DiscountCalculatorPipe,
    ImageFallbackDirective,
    ProductReviewsComponent,
    RelatedProductsComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private location = inject(Location);
  private router = inject(Router);

  @Input() id!: string;

  product?: Product;
  selectedImage: string = '';
  quantity: number = 1;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const numericId = Number(this.id);
    if (!Number.isNaN(numericId)) {
      this.product = this.productService.getProductById(numericId);
      if (this.product) {
        this.selectedImage =
          this.product.images?.[0] || this.product.thumbnail || '';
      }
    }
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.location.back();
  }

  addToCart(): void {
    if (this.product) {
      alert(`Đã thêm ${this.quantity} sản phẩm "${this.product.title}" vào giỏ hàng!`);
    }
  }
}
