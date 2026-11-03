import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { ProductFilterBarComponent } from '../product-filter-bar/product-filter-bar.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterBarComponent],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss',
})
export class ProductCatalogComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  searchKeyword = '';
  selectedCategory = 'all';

  // Quản lý phân trang
  currentPage = 1;
  readonly pageSize = 8;
  totalProducts = 0;

  // Placeholder cho hiệu ứng Skeleton Loading
  skeletonArray = Array(8).fill(0);

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize) || 1;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  get startIndex(): number {
    if (this.totalProducts === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalProducts);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const keyword = this.searchKeyword.trim();
    let request$;

    if (keyword) {
      // Tìm kiếm server-side có phân trang
      request$ = this.productService.searchProducts(
        keyword,
        this.currentPage,
        this.pageSize,
      );
    } else if (this.selectedCategory && this.selectedCategory !== 'all') {
      // Lọc theo danh mục có phân trang
      request$ = this.productService.getProductsByCategory(
        this.selectedCategory,
        this.currentPage,
        this.pageSize,
      );
    } else {
      // Lấy toàn bộ danh sách có phân trang
      request$ = this.productService.getProducts(
        this.currentPage,
        this.pageSize,
      );
    }

    request$.subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalProducts = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
        this.errorMessage =
          'Không thể kết nối đến máy chủ DummyJSON. Vui lòng kiểm tra lại kết nối mạng!';
        this.isLoading = false;
      },
    });
  }

  onSearchChange(keyword: string): void {
    this.searchKeyword = keyword;
    this.currentPage = 1;
    this.loadProducts();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage ||
      this.isLoading
    ) {
      return;
    }
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(`Bạn có chắc muốn xóa "${product.title}" không?`);
    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        // DummyJSON chỉ giả lập xóa, ta xóa trực tiếp trên danh sách hiện tại
        this.products = this.products.filter((p) => p.id !== product.id);
        this.totalProducts = Math.max(0, this.totalProducts - 1);
        alert(`Đã xóa sản phẩm "${product.title}" thành công!`);
      },
      error: (err) => {
        console.error('Lỗi khi xóa sản phẩm:', err);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
      },
    });
  }

  onAddToCart(product: Product): void {
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
  }
}
