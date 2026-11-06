import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/model/cart.model';
import { VndCurrencyPipe } from '../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../shared/pipes/discount-calculator.pipe';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    VndCurrencyPipe,
    DiscountCalculatorPipe,
    ImageFallbackDirective,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  // Expose signals trực tiếp từ CartService
  readonly cartItems = this.cartService.cartItems;
  readonly totalItemsCount = this.cartService.totalItemsCount;
  readonly totalCartPrice = this.cartService.totalCartPrice;
  readonly totalOriginalPrice = this.cartService.totalOriginalPrice;
  readonly totalSavings = this.cartService.totalSavings;
  readonly isEmpty = this.cartService.isEmpty;

  increaseQuantity(item: CartItem): void {
    if (item.product.stock != null && item.quantity >= item.product.stock) {
      alert(`Số lượng trong kho chỉ còn ${item.product.stock} sản phẩm!`);
      return;
    }
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.removeItem(item.product.id, item.product.title);
    }
  }

  onQuantityInput(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value <= 0) {
      input.value = item.quantity.toString();
      return;
    }

    if (item.product.stock != null && value > item.product.stock) {
      alert(`Số lượng trong kho chỉ còn ${item.product.stock} sản phẩm!`);
      input.value = item.product.stock.toString();
      this.cartService.updateQuantity(item.product.id, item.product.stock);
      return;
    }

    this.cartService.updateQuantity(item.product.id, value);
  }

  removeItem(productId: number, productTitle: string): void {
    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa "${productTitle}" khỏi giỏ hàng?`
    );
    if (confirmed) {
      this.cartService.removeFromCart(productId);
    }
  }

  clearCart(): void {
    const confirmed = confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?');
    if (confirmed) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.isEmpty()) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
