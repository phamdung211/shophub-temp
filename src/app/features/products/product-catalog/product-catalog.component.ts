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
}
