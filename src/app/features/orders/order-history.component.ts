import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { Order, OrderStatus } from '../../core/model/order.model';
import { VndCurrencyPipe } from '../../shared/pipes/vnd-currency.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, VndCurrencyPipe, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  readonly authService = inject(AuthService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  // Tab trạng thái đang chọn
  selectedStatus = signal<string>('all');

  // Đơn hàng đang được chọn để xem trong Modal chi tiết
  selectedOrder = signal<Order | null>(null);

  // Danh sách các trạng thái dùng cho select giả lập
  readonly allStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // Lọc danh sách đơn hàng thuộc về user đang đăng nhập
  readonly myOrders = computed(() => {
    const user = this.authService.currentUser();
    const allOrders = this.orderService.orders();
    if (!user) return [];
    // Lọc theo userId (ép kiểu an toàn số/chuỗi) hoặc hiển thị đơn hàng gắn với phiên làm việc
    return allOrders.filter(
      (order) => String(order.userId) === String(user.id) || !order.userId
    );
  });

  // Đếm số lượng đơn hàng theo từng trạng thái để hiển thị badge trên tab
  readonly statusCounts = computed(() => {
    const orders = this.myOrders();
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  });

  // Danh sách đơn hàng được hiển thị sau khi lọc theo Tab
  readonly displayedOrders = computed(() => {
    const orders = this.myOrders();
    const status = this.selectedStatus();
    if (status === 'all') return orders;
    return orders.filter(o => o.status === status);
  });

  // Chuyển tab trạng thái
  setStatusFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  // Mở modal xem chi tiết
  openOrderDetail(order: Order): void {
    this.selectedOrder.set(order);
  }

  // Đóng modal xem chi tiết
  closeOrderDetail(): void {
    this.selectedOrder.set(null);
  }

  // Cập nhật trạng thái đơn hàng (Dành cho Demo / Dev test các Tab)
  onStatusChange(order: Order, newStatus: OrderStatus): void {
    const success = this.orderService.updateOrderStatus(order.id, newStatus);
    if (success) {
      this.toastService.success(
        `Đã đổi trạng thái đơn #${order.id} sang "${this.getStatusLabel(newStatus)}"`
      );
      if (this.selectedOrder()?.id === order.id) {
        this.selectedOrder.update((curr) =>
          curr ? { ...curr, status: newStatus } : null
        );
      }
    }
  }

  // Hủy đơn hàng (khi đang ở pending)
  cancelOrder(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (order.status !== 'pending') {
      this.toastService.warning('Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xử lý!');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.id}?`);
    if (!confirmed) return;

    const success = this.orderService.cancelOrder(order.id);
    if (success) {
      this.toastService.success(`Đã hủy thành công đơn hàng #${order.id}`);
      // Nếu đang mở modal của đơn này, cập nhật lại trạng thái hiển thị
      if (this.selectedOrder()?.id === order.id) {
        this.selectedOrder.update(curr => curr ? { ...curr, status: 'cancelled' } : null);
      }
    } else {
      this.toastService.error('Không thể hủy đơn hàng này!');
    }
  }

  // Helper lấy nhãn hiển thị trạng thái
  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang vận chuyển';
      case 'delivered': return 'Giao thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  // Helper lấy class màu cho badge trạng thái
  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  // Helper lấy icon trạng thái
  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '📋';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  }
}

