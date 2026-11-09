import { Injectable, signal } from '@angular/core';

export type CurrencyType = 'VND' | 'USD';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    private readonly EXCHANGE_RATE = 25400; // 1 USD = 25.400 VND

    // Signal lưu loại tiền tệ hiện tại: 'VND' hoặc 'USD' (lưu vào localStorage)
    currentCurrency = signal<CurrencyType>(
        (localStorage.getItem('shophub_currency') as CurrencyType) || 'VND'
    );

    // Đổi qua lại giữa VND và USD
    toggleCurrency(): void {
        const next = this.currentCurrency() === 'VND' ? 'USD' : 'VND';
        this.currentCurrency.set(next);
        localStorage.setItem('shophub_currency', next);
    }

    // Format giá tiền theo loại tiền tệ hiện tại
    format(usdAmount: number | null | undefined): string {
        if (usdAmount == null || !Number.isFinite(usdAmount)) return '—';

        // Nếu chọn USD: Format chuẩn $
        if (this.currentCurrency() === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(usdAmount);
        }

        // Nếu chọn VND: Nhân với tỷ giá và format ₫
        const vnd = usdAmount * this.EXCHANGE_RATE;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(vnd);
    }
}