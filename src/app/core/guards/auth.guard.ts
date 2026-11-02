import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    alert('⚠️ Bạn cần đăng nhập với quyền Admin để truy cập trang này!');
    return router.createUrlTree(['/products']);
};