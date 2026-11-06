import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
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
export class ProductDetailComponent implements OnInit, OnChanges {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private location = inject(Location);
  private router = inject(Router);

  @Input() id!: string;

  product?: Product;
  selectedImage: string = '';
  quantity: number = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      this.quantity = 1;
      this.loadProduct();
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadProduct(): void {
    const numericId = Number(this.id);
    if (!Number.isNaN(numericId)) {
      this.isLoading = true;
      this.productService.getProductById(numericId).subscribe({
        next: (data) => {
          this.product = data;
          this.selectedImage =
            data.images?.[0] || data.thumbnail || '';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi tải chi tiết sản phẩm:', err);
          this.product = undefined;
          this.isLoading = false;
        },
      });
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
      this.cartService.addToCart(this.product, this.quantity);
    }
  }
}
