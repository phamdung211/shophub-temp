import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    RouterLink,
    ConfirmModalComponent,
    VndCurrencyPipe,
    ImageFallbackDirective,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  products: Product[] = [];
  isLoading = false;

  //phân trang 
  currentPage = 1;
  readonly pageSize = 10;
  totalProducts = 0;

  //quản lý trạng thái Modal 
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;
  isDeleting = false;

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize) || 1;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.products;
        this.totalProducts = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách:', err);
        this.toastService.error('Không thể tải danh sách sản phẩm!');
        this.isLoading = false;
      },
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  // --- XỬ LÝ MODAL XÓA ---
  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    const id = this.productToDelete.id;
    const title = this.productToDelete.title;
    this.isDeleting = true;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        //cập nhật giao diện
        this.products = this.products.filter((p) => p.id !== id);
        this.totalProducts = Math.max(0, this.totalProducts - 1);
        this.toastService.success(`Đã xóa sản phẩm "${title}" thành công!`);
        this.isDeleting = false;
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Lỗi khi xóa:', err);
        this.toastService.error('Có lỗi xảy ra khi xóa sản phẩm!');
        this.isDeleting = false;
        this.closeDeleteModal();
      },
    });
  }
}