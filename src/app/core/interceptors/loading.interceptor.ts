
import { inject } from '@angular/core';
import {
    HttpInterceptorFn
} from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Tăng số lượng request đang chạy
    loadingService.show();

    return next(req).pipe(
        finalize(() => {
            // Giảm số lượng request khi kết thúc
            loadingService.hide();
        })
    );
};
