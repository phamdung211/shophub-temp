import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Product } from '../../../core/model/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;

  quantity = 1;

  get inStock(): boolean {
    return this.product.stock > 0;
  }

  addToCart(): void {
    if (!Number.isInteger(this.quantity) || this.quantity < 1) {
      alert('Số lượng phải là số nguyên lớn hơn hoặc bằng 1');
      return;
    }

    if (!this.inStock) {
      return;
    }

    console.log(
      `Đã thêm ${this.quantity} sản phẩm ${this.product.title} vào giỏ hàng`,
    );

    alert(
      `Đã thêm ${this.quantity} sản phẩm ${this.product.title} vào giỏ hàng`,
    );
  }

  isInteger(value: number): boolean {
    return Number.isInteger(value);
  }
}
