import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/model/cart.model';
import { VndCurrencyPipe } from '../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../shared/pipes/discount-calculator.pipe';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ToastService } from '../../core/services/toast.service';

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
  private toastService = inject(ToastService);
  // Expose signals trực tiếp từ CartService
  readonly cartItems = this.cartService.cartItems;
  readonly totalItemsCount = this.cartService.totalItemsCount;
  readonly totalCartPrice = this.cartService.totalCartPrice;
  readonly totalOriginalPrice = this.cartService.totalOriginalPrice;
  readonly totalSavings = this.cartService.totalSavings;
  readonly isEmpty = this.cartService.isEmpty;

  // Signal quản lý Modal xác nhận
  confirmModal = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  increaseQuantity(item: CartItem): void {
    if (item.product.stock != null && item.quantity >= item.product.stock) {
      this.toastService.warning(`Số lượng trong kho chỉ còn ${item.product.stock} sản phẩm!`);
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
      this.toastService.warning(`Số lượng trong kho chỉ còn ${item.product.stock} sản phẩm!`);
      input.value = item.product.stock.toString();
      this.cartService.updateQuantity(item.product.id, item.product.stock);
      return;
    }

    this.cartService.updateQuantity(item.product.id, value);
  }

  removeItem(productId: number, productTitle: string): void {
    this.confirmModal.set({
      isOpen: true,
      title: 'Xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa "${productTitle}" khỏi giỏ hàng không?`,
      onConfirm: () => {
        this.cartService.removeFromCart(productId);
        this.toastService.info(`Đã xóa "${productTitle}" khỏi giỏ hàng!`);
        this.closeModal();
      },
    });
  }

  clearCart(): void {
    this.confirmModal.set({
      isOpen: true,
      title: 'Xóa toàn bộ giỏ hàng',
      message: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không? Hành động này không thể hoàn tác.',
      onConfirm: () => {
        this.cartService.clearCart();
        this.toastService.info('Đã xóa toàn bộ giỏ hàng!');
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.confirmModal.update((m) => ({ ...m, isOpen: false }));
  }

  proceedToCheckout(): void {
    if (this.isEmpty()) {
      // Thay vì: alert('Giỏ hàng của bạn đang trống!');
      this.toastService.info('Giỏ hàng của bạn đang trống! Hãy chọn sản phẩm trước nhé.');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
