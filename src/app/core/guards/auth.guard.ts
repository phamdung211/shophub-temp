import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);
    if (authService.isLoggedIn()) {
        return true;
    }

    toastService.warning('Bạn cần đăng nhập để tiếp tục!');
    return router.createUrlTree(['/login']);
};