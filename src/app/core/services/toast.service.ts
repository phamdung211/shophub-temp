import { Injectable, signal } from "@angular/core";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;

}

@Injectable({ providedIn: 'root' })
export class ToastService {
    // Lưu danh sách các toast đang hiển thị
    toasts = signal<Toast[]>([]);

    show(message: string, type: ToastType = 'info', duration = 3000): void {
        const id = Date.now();
        const newToast: Toast = { id, message, type };

        // Thêm toast mới vào Signal
        this.toasts.update(list => [...list, newToast]);

        // Tự động xóa sau khoảng thời gian duration
        setTimeout(() => this.remove(id), duration);
    }

    remove(id: number): void {
        this.toasts.update(list => list.filter(t => t.id !== id));
    }

    // Các hàm tiện ích ngắn gọn:
    success(msg: string) { this.show(msg, 'success'); }
    error(msg: string) { this.show(msg, 'error'); }
    warning(msg: string) { this.show(msg, 'warning'); }
    info(msg: string) { this.show(msg, 'info'); }
}


