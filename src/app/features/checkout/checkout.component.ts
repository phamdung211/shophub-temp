import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { VndCurrencyPipe } from '../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../shared/pipes/discount-calculator.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    VndCurrencyPipe,
    DiscountCalculatorPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  //trạng thái đang gửi đơn hàng
  isSubmitting = signal(false);

  //định nghĩa Reactive Form với validation
  checkoutForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    customerPhone: ['', [
      Validators.required,
      Validators.pattern(/^(0|84)[3|5|7|8|9][0-9]{8}$/)
    ]],
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
    paymentMethod: ['cod', [Validators.required]],
    note: ['']
  });

  ngOnInit(): void {
    //điền sẵn họ tên nếu người dùng đã đăng nhập
    const user = this.authService.currentUser();
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
      this.checkoutForm.patchValue({ customerName: fullName });
    }
  }

  //xử lý đặt hàng
  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toastService.warning('Vui lòng kiểm tra lại thông tin nhận hàng!');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.checkoutForm.getRawValue();
    const currentUser = this.authService.currentUser();

    //chuẩn bị dữ liệu đơn hàng
    const orderPayload = {
      userId: currentUser?.id || 1,
      customerName: formVal.customerName!,
      customerPhone: formVal.customerPhone!,
      shippingAddress: formVal.shippingAddress!,
      paymentMethod: formVal.paymentMethod as 'cod' | 'banking',
      note: formVal.note || '',
      items: this.cartService.cartItems(),
      totalAmount: this.cartService.totalCartPrice(),
    };

    //gọi API đặt hàng qua OrderService
    this.orderService.createOrder(orderPayload).subscribe({
      next: (order) => {
        this.toastService.success('Đặt hàng thành công!');
        //xóa giỏ hàng
        this.cartService.clearCart();
        //điều hướng sang trang chúc mừng
        this.router.navigate(['/order-success', order.id]);
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra khi xử lý đơn hàng, vui lòng thử lại!');
        this.isSubmitting.set(false);
      }
    });
  }
}