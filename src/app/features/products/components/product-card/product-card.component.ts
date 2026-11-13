import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';

import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/model/product.model';

import { VndCurrencyPipe } from '../../../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../../../shared/pipes/discount-calculator.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { HoverCardDirective } from '../../../../shared/directives/hover-card.directive';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    DecimalPipe,
    NgClass,
    RouterLink,
    VndCurrencyPipe,
    DiscountCalculatorPipe,
    TruncatePipe,
    ImageFallbackDirective,
    HoverCardDirective,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnChanges, OnDestroy {
  private readonly cartService = inject(CartService);

  @Input({ required: true }) product!: Product;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() buyNow = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[ProductCard] ngOnChanges', changes);
  }

  ngOnInit(): void {
    console.log('[ProductCard] ngOnInit', this.product);
  }

  ngOnDestroy(): void {
    console.log('[ProductCard] ngOnDestroy');
  }

  onAddToCartClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.addToCart.emit(this.product);
  }

  onBuyNowClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.buyNow.emit(this.product);
  }

  // Giữ alias tương thích nếu có code cũ gọi
  onBuyClick(): void {
    this.onBuyNowClick();
  }

  onDeleteClick(): void {
    this.delete.emit(this.product);
  }
  isOutOfStock(): boolean {
    if (!this.product || this.product.stock == null || this.product.stock <= 0) {
      return true;
    }
    const inCart = this.cartService.getItemQuantity(this.product.id);
    return inCart >= this.product.stock;
  }
}
