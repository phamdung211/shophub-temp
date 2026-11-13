import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal, effect } from "@angular/core";
import { StorageService } from "./storage.service";
import { Order, OrderStatus } from "../model/order.model";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly storageService = inject(StorageService);
    private readonly STORAGE_KEY = 'shophub_orders';
    private readonly API_URL = 'https://dummyjson.com/carts/add';

    //signal đọc danh sách đơn hàng đã lưu từ LocalStorage
    private ordersSignal = signal<Order[]>(
        this.storageService.getItem<Order[]>(this.STORAGE_KEY, [])
    );
    constructor() {
        //đồng bộ danh sách đơn hàng vào LocalStorage mỗi khi ordersSignal thay đổi
        effect(() => {
            this.storageService.setItem(this.STORAGE_KEY, this.ordersSignal());
        });
    }
    /**
    * Gửi đơn hàng lên DummyJSON API và lưu vào LocalStorage
    * @param orderData Thông tin đơn hàng (người nhận, địa chỉ, giỏ hàng...)
    */
    createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Observable<Order> {
        //chuẩn hóa dữ liệu đúng định dạng DummyJSON yêu cầu
        const payload = {
            userId: orderData.userId,
            products: orderData.items.map((item) => ({
                id: item.product.id,
                quantity: item.quantity,
            })),
        };

        //gọi POST lên API
        return this.http.post<any>(this.API_URL, payload).pipe(
            map((response) => {
                // DummyJSON là mock API nên luôn trả về cố định response.id = 209
                // Sử dụng Date.now() để mỗi đơn hàng có ID duy nhất, tránh trùng lặp key trong LocalStorage và UI
                const uniqueId = Date.now();
                const newOrder: Order = {
                    ...orderData,
                    id: uniqueId,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };

                //đẩy đơn mới vào đầu mảng Signal (UI sẽ cập nhật ngay)
                this.ordersSignal.update((orders) => [newOrder, ...orders]);

                return newOrder;
            })
        );
    }
    /**
    * Lấy chi tiết một đơn hàng theo ID
    */
    getOrderById(orderId: number | string): Order | undefined {
        return this.ordersSignal().find((order) => String(order.id) === String(orderId));
    }

    /**
    * Cập nhật trạng thái đơn hàng (Dành cho Admin hoặc Demo/Test luồng giao vận)
    */
    updateOrderStatus(orderId: number, status: OrderStatus): boolean {
        let isUpdated = false;
        this.ordersSignal.update((orders) =>
            orders.map((order) => {
                if (order.id === orderId) {
                    isUpdated = true;
                    return { ...order, status };
                }
                return order;
            })
        );
        return isUpdated;
    }

    /**
    * Hủy đơn hàng khi còn ở trạng thái pending
    */
    cancelOrder(orderId: number): boolean {
        let isCancelled = false;
        this.ordersSignal.update((orders) =>
            orders.map((order) => {
                if (order.id === orderId && order.status === 'pending') {
                    isCancelled = true;
                    return { ...order, status: 'cancelled' as const };
                }
                return order;
            })
        );
        return isCancelled;
    }

    readonly orders = this.ordersSignal.asReadonly();
}
