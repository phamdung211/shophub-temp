import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../../core/model/product.model';
import { ProductService } from '../../../../../core/services/product.service';
import { VndCurrencyPipe } from '../../../../../shared/pipes/vnd-currency.pipe';
import { DiscountCalculatorPipe } from '../../../../../shared/pipes/discount-calculator.pipe';
import { ImageFallbackDirective } from '../../../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    VndCurrencyPipe,
    DiscountCalculatorPipe,
    ImageFallbackDirective,
  ],
  template: `
    <div class="mt-12 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
      <div class="border-b border-gray-100 pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <p class="text-xs text-gray-500 mt-1">Gợi ý các mặt hàng cùng danh mục (Tải hoãn bằng &#64;defer)</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (item of relatedProducts; track item.id) {
          <a
            [routerLink]="['/products', item.id]"
            class="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              <div class="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center mb-3">
                <img
                  [src]="item.thumbnail"
                  [appImageFallback]="'assets/images/product-placeholder.svg'"
                  [alt]="item.title"
                  class="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span class="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 capitalize">
                {{ item.category }}
              </span>
              <h3 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
                {{ item.title }}
              </h3>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
              <span class="text-base font-bold text-red-600">
                {{ item.price | discountCalculator: item.discountPercentage | vndCurrency }}
              </span>
              @if (item.discountPercentage > 0) {
                <span class="text-xs text-gray-400 line-through">
                  {{ item.price | vndCurrency }}
                </span>
              }
            </div>
          </a>
        } @empty {
          <div class="col-span-full py-8 text-center text-sm text-gray-500">
            Không có sản phẩm liên quan nào khác.
          </div>
        }
      </div>
    </div>
  `,
})
export class RelatedProductsComponent implements OnInit {
  private productService = inject(ProductService);

  @Input() category?: string;
  @Input() currentProductId?: number;

  relatedProducts: Product[] = [];

  ngOnInit(): void {
    const all = this.productService.getProducts();
    this.relatedProducts = all
      .filter((p) => p.id !== this.currentProductId && (!this.category || p.category === this.category))
      .slice(0, 4);

    // Nếu không đủ sản phẩm cùng loại, lấy thêm các sản phẩm khác
    if (this.relatedProducts.length < 4) {
      const remaining = all
        .filter((p) => p.id !== this.currentProductId && !this.relatedProducts.some((r) => r.id === p.id))
        .slice(0, 4 - this.relatedProducts.length);
      this.relatedProducts = [...this.relatedProducts, ...remaining];
    }
  }
}

