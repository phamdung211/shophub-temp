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

  // Danh mục được chọn
  // selectedCategory = 'all';

  // Sự kiện gửi lên Smart Component (ProductCatalogComponent)
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

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
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
