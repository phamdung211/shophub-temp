import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-12 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
          <p class="text-xs text-gray-500 mt-1">Dữ liệu được tải lười (Lazy Defer) khi cuộn tới màn hình</p>
        </div>
        <div class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          <span class="text-amber-500 text-lg">⭐</span>
          <span class="font-bold text-gray-900">4.8 / 5.0</span>
          <span class="text-xs text-gray-400">({{ reviews.length }} nhận xét)</span>
        </div>
      </div>

      <div class="space-y-4">
        @for (rev of reviews; track rev.id) {
          <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {{ rev.author.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">{{ rev.author }}</h4>
                  <div class="flex text-amber-400 text-xs">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <span>{{ star <= rev.rating ? '★' : '☆' }}</span>
                    }
                  </div>
                </div>
              </div>
              <span class="text-xs text-gray-400">{{ rev.date }}</span>
            </div>
            <p class="text-sm text-gray-600 pl-12">{{ rev.comment }}</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductReviewsComponent {
  @Input() productId?: number;

  reviews: Review[] = [
    {
      id: 1,
      author: 'Nguyễn Văn An',
      rating: 5,
      date: '25/10/2026',
      comment: 'Sản phẩm đóng gói rất cẩn thận, giao hàng nhanh chóng trong 2 ngày. Chất lượng đúng như mô tả!',
    },
    {
      id: 2,
      author: 'Trần Thị Mai',
      rating: 5,
      date: '20/10/2026',
      comment: 'Dùng rất thích, hoàn thiện đẹp và cao cấp. Sẽ tiếp tục ủng hộ shop trong các đơn tới.',
    },
    {
      id: 3,
      author: 'Lê Hoàng Nam',
      rating: 4,
      date: '15/10/2026',
      comment: 'Máy chạy êm, thiết kế gọn nhẹ. Trừ 1 sao vì hộp ngoài hơi móp nhẹ trong quá trình vận chuyển.',
    },
  ];
}

