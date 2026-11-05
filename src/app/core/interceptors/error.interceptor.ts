import { inject } from '@angular/core';
import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // Xóa token vì phiên đăng nhập không còn hợp lệ
                    localStorage.removeItem('token');

                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    router.navigate(['/login']);
                    break;

                case 403:
                    alert('Bạn không có quyền truy cập tài nguyên này.');
                    break;

                case 500:
                    alert('Máy chủ đang gặp sự cố. Vui lòng thử lại sau.');
                    break;

                default:
                    console.error('HTTP Error:', error);
                    break;
            }

            // Giữ lỗi trong Observable để Service/Component tiếp tục nhận được
            return throwError(() => error);
        })
    );
};