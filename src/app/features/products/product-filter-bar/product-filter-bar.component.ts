import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-filter-bar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-filter-bar.component.html',
  styleUrl: './product-filter-bar.component.scss',
})
export class ProductFilterBarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  // FormControl quản lý ô tìm kiếm
  searchControl = new FormControl('', { nonNullable: true });

  // Danh mục được chọn
  selectedCategory = 'all';

  // Sự kiện gửi lên Smart Component (ProductCatalogComponent)
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  categories = [
    { label: 'Tất cả danh mục', value: 'all' },
    { label: 'Laptop', value: 'laptops' },
    { label: 'Điện thoại', value: 'smartphones' },
    { label: 'Phụ kiện', value: 'accessories' },
    { label: 'Nước hoa', value: 'fragrances' },
  ];

  ngOnInit(): void {
    // Luồng dữ liệu phản ứng (Reactive Stream) với RxJS
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
  }

  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
