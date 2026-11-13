import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../core/services/product.service';

export interface FilterCriteria {
  keyword: string;
  category: string;
  maxPrice: number;    // Giới hạn giá tối đa từ slider ($0 -> maxPrice)
  minRating: number;   // 0 (tất cả), 4.0, 4.5
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating-desc';
}

@Component({
  selector: 'app-product-filter-bar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-filter-bar.component.html',
  styleUrl: './product-filter-bar.component.scss',
})
export class ProductFilterBarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private productService = inject(ProductService);

  // FormControl quản lý ô tìm kiếm
  searchControl = new FormControl('', { nonNullable: true });

  // Quản lý giá trị lọc
  // selectedCategory = 'all';
  maxPrice = 2000;         // Giá trị mặc định của slider ($2000)
  minRating = 0;           // 0: Tất cả, 4: >=4★, 4.5: >=4.5★
  sortBy: FilterCriteria['sortBy'] = 'default';

  // Quản lý responsive trên Mobile
  isMobileFilterOpen = false;

  // Sự kiện gửi lên Smart Component (ProductCatalogComponent)
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<FilterCriteria>();

  @Input() selectedCategory = 'all';

  categories: { label: string; value: string }[] = [
    { label: 'Tất cả danh mục', value: 'all' },
    { label: 'Smartphones', value: 'smartphones' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Fragrances', value: 'fragrances' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Groceries', value: 'groceries' },
  ];

  ngOnInit(): void {
    // 1. Luồng dữ liệu phản ứng (Reactive Stream) với RxJS debounce cho tìm kiếm
    this.searchControl.valueChanges
      .pipe(
        // Chờ 300ms sau khi người dùng ngừng gõ phím mới phát giá trị tiếp theo
        debounceTime(300),
        // Chỉ phát nếu từ khóa thực sự thay đổi so với giá trị trước
        distinctUntilChanged(),
        // Tự động hủy đăng ký khi component bị destroy, ngăn ngừa triệt để rò rỉ bộ nhớ
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((keyword) => {
        this.searchChange.emit(keyword.trim());
      });

    // 2. Tải danh mục thực tế từ DummyJSON REST API
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (apiCategories) => {
          if (Array.isArray(apiCategories) && apiCategories.length > 0) {
            this.categories = [
              { label: 'Tất cả danh mục', value: 'all' },
              ...apiCategories.map((c) => ({
                label: c.name || c.slug,
                value: c.slug,
              })),
            ];
          }
        },
        error: (err) => {
          console.warn('Không thể tải danh mục từ API, dùng danh mục dự phòng:', err);
        },
      });
  }

  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory);
    // this.emitFilterChange();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  emitFilterChange(): void {
    this.filterChange.emit({
      keyword: this.searchControl.value.trim(),
      category: this.selectedCategory,
      maxPrice: this.maxPrice,
      minRating: this.minRating,
      sortBy: this.sortBy,
    });
  }

  resetFilters(): void {

    this.searchControl.setValue('');

    // this.selectedCategory = 'all';

    this.maxPrice = 2000;

    this.minRating = 0;

    this.sortBy = 'default';

    this.emitFilterChange();
  }
}
