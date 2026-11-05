
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // 1. Đọc Token từ LocalStorage
    const token = localStorage.getItem('token');

    // 2. Kiểm tra Token
    if (token) {
        // 3. Clone Request và thêm Authorization Header
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        // 4. Chuyển Request đã có Token đi tiếp
        return next(clonedReq);
    }

    // 5. Nếu không có Token, giữ nguyên Request
    return next(req);
};
