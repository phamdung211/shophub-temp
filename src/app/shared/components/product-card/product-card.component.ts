import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() name = '';
  @Input() price = 0;
  @Input() imageUrl = '';
  @Input() inStock = false;
  quantity = 1;

  addToCart(): void {
    if (!Number.isInteger(this.quantity) || this.quantity < 1) {
      console.log('Số lượng phải là số nguyên lớn hơn hoặc bằng 1');
      return;
    }

    console.log(`Đã thêm ${this.quantity} sản phẩm ${this.name} vào giỏ hàng`);
    alert(`Đã thêm ${this.quantity} sản phẩm ${this.name} vào giỏ hàng`);
  }
}
