import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink, VndCurrencyPipe],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {
  // Tự động nhận :orderId từ URL
  @Input() orderId!: string;

  private orderService = inject(OrderService);

  // Lấy thông tin đơn hàng vừa lưu trong LocalStorage
  get order() {
    return this.orderService.getOrderById(this.orderId);
  }
}