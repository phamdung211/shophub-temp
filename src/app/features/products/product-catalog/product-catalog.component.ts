import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductFilterBarComponent } from '../product-filter-bar/product-filter-bar.component';
import { Product } from '../../../core/model/product.model';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [ProductCardComponent, ProductFilterBarComponent],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss',
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      title: 'Laptop ASUS',
      description: 'Laptop phục vụ học tập và làm việc',
      price: 20000000,
      discountPercentage: 15,
      rating: 4.8,
      stock: 10,
      brand: 'ASUS',
      category: 'laptops',
      thumbnail: 'https://placehold.co/600x400?text=Laptop',
      images: ['https://placehold.co/600x400?text=Laptop'],
    },
    {
      id: 2,
      title: 'Tai nghe không dây',
      description: 'Tai nghe không dây chất lượng cao',
      price: 1200000,
      discountPercentage: 5,
      rating: 4.5,
      stock: 20,
      brand: 'Sony',
      category: 'accessories',
      thumbnail: 'https://placehold.co/600x400?text=Headphones',
      images: ['https://placehold.co/600x400?text=Headphones'],
    },
    {
      id: 3,
      title: 'Bàn phím cơ',
      description: 'Bàn phím cơ dành cho chơi game',
      price: 850000,
      discountPercentage: 20,
      rating: 4.6,
      stock: 0,
      brand: 'Logitech',
      category: 'accessories',
      thumbnail: 'https://placehold.co/600x400?text=Keyboard',
      images: ['https://placehold.co/600x400?text=Keyboard'],
    },
    {
      id: 4,
      title: 'Điện thoại Samsung',
      description: 'Điện thoại thông minh',
      price: 12000000,
      discountPercentage: 12,
      rating: 4.7,
      stock: 15,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'https://placehold.co/600x400?text=Samsung',
      images: ['https://placehold.co/600x400?text=Samsung'],
    },
    {
      id: 5,
      title: 'Laptop Lenovo',
      description: 'Laptop văn phòng',
      price: 16000000,
      discountPercentage: 8,
      rating: 4.4,
      stock: 7,
      brand: 'Lenovo',
      category: 'laptops',
      thumbnail: 'https://placehold.co/600x400?text=Lenovo',
      images: ['https://placehold.co/600x400?text=Lenovo'],
    },
    {
      id: 6,
      title: 'Nước hoa',
      description: 'Nước hoa sử dụng hằng ngày',
      price: 950000,
      discountPercentage: 18,
      rating: 4.3,
      stock: 12,
      brand: 'Dior',
      category: 'fragrances',
      thumbnail: 'https://placehold.co/600x400?text=Perfume',
      images: ['https://placehold.co/600x400?text=Perfume'],
    },
    {
      id: 7,
      title: 'Chuột không dây',
      description: 'Chuột không dây tiện lợi',
      price: 450000,
      discountPercentage: 10,
      rating: 4.2,
      stock: 25,
      brand: 'Logitech',
      category: 'accessories',
      thumbnail: 'https://placehold.co/600x400?text=Mouse',
      images: ['https://placehold.co/600x400?text=Mouse'],
    },
    {
      id: 8,
      title: 'Điện thoại Xiaomi',
      description: 'Điện thoại thông minh hiệu năng tốt',
      price: 7500000,
      discountPercentage: 25,
      rating: 4.6,
      stock: 0,
      brand: 'Xiaomi',
      category: 'smartphones',
      thumbnail: 'https://placehold.co/600x400?text=Xiaomi',
      images: ['https://placehold.co/600x400?text=Xiaomi'],
    },
  ];
  searchText = '';
  selectedCategory = 'all';

  ngOnInit(): void {
    console.log('[Catalog] ngOnInit');

    // Nếu chưa dùng API, khởi tạo hoặc gán danh sách mẫu hiện có.
  }

  get filteredProducts(): Product[] {
    return this.products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.category.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(keyword: string): void {
    this.searchText = keyword;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  handleAddToCart(product: Product): void {
    console.log('Sản phẩm được chọn mua:', product);

    // Có thể tích hợp CartService sau khi hoàn thiện luồng sự kiện.
  }
}
