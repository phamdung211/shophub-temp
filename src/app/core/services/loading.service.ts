import { computed, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class LoadingService {
    // Đếm số lượng HTTP Request đang chạy
    private activeRequests = signal<number>(0);

    // Trạng thái Loading: true nếu còn request đang chạy
    isLoading = computed(() => this.activeRequests() > 0);

    // Tăng số lượng request khi bắt đầu
    show(): void {
        this.activeRequests.update(current => current + 1);
    }

    // Giảm số lượng request khi kết thúc
    hide(): void {
        this.activeRequests.update(current => Math.max(0, current - 1));
    }
}