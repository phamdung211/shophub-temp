import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/model/product.model';

import { VndCurrencyPipe } from '../../../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../../../shared/pipes/discount-calculator.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { HoverCardDirective } from '../../../../shared/directives/hover-card.directive';

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
  @Input({ required: true }) product!: Product;

  @Output() addToCart = new EventEmitter<Product>();
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

  onBuyClick(): void {
    this.addToCart.emit(this.product);
  }
  onDeleteClick(): void {
    this.delete.emit(this.product);
  }
}
