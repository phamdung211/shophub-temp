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

import { DecimalPipe } from '@angular/common';
import { Product } from '../../../core/model/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

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
}
