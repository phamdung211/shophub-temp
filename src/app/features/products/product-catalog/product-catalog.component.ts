import { Component, inject } from '@angular/core';
import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss',
})
export class ProductCatalogComponent {
  private productService = inject(ProductService);

  products: Product[] = this.productService.getProducts();

  searchKeyword = '';
  selectedCategory = 'all';

  get filteredProducts(): Product[] {
    return this.productService.getFilteredProducts(
      this.selectedCategory,
      this.searchKeyword,
    );
  }

  onSearchChange(keyword: string): void {
    this.searchKeyword = keyword;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  reloadProducts(): void {
    this.products = this.productService.getProducts();
  }
  deleteProduct(product: Product): void {
    const confirmed = confirm(`Bạn có chắc muốn xóa "${product.title}" không?`);

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id);
    this.products = this.productService.getProducts();
  }

  // onAddToCart(product: Product): void {
  //   console.log('Đã nhận sản phẩm:', product);
  // }
  onAddToCart(product: Product): void {
    const success = this.productService.buyProduct(product.id);

    if (success) {
      // Cập nhật danh sách sản phẩm sau khi trừ kho
      this.products = this.productService.getProducts();

      alert(`Mua ${product.title} thành công!`);
    } else {
      alert('Sản phẩm đã hết hàng!');
    }
  }
}
