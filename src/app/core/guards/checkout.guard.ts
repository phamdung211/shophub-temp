import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';

export const checkoutGuard: CanActivateFn = () => {
    const cartService = inject(CartService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    // Kiểm tra nếu giỏ hàng trống
    if (cartService.isEmpty()) {
        toastService.warning('Giỏ hàng trống! Hãy chọn sản phẩm trước khi thanh toán.');
        return router.createUrlTree(['/cart']);
    }

    return true;
};