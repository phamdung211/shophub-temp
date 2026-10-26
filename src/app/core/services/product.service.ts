import { Injectable, inject } from '@angular/core';
import { Product } from '../model/product.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageService = inject(StorageService);

  private readonly storageKey = 'shophub_products';

  private readonly initialProducts: Product[] = [
    {
      id: 1,
      title: 'Laptop ASUS',
      description: 'Laptop phục vụ học tập và làm việc',
      price: 2000000,
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

  private products: Product[] = this.storageService.getItem<Product[]>(
    this.storageKey,
    this.initialProducts,
  );

  constructor() {
    if (!this.storageService.hasItem(this.storageKey)) {
      this.saveProducts();
    }
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: Product['id']): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  addProduct(product: Product): void {
    this.products = [...this.products, product];
    this.saveProducts();
  }

  filterByCategory(category: string): Product[] {
    if (!category || category === 'all') {
      return this.getProducts();
    }

    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  searchProducts(keyword: string): Product[] {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return this.getProducts();
    }

    return this.products.filter(
      (product) =>
        product.title.toLowerCase().includes(normalizedKeyword) ||
        product.description.toLowerCase().includes(normalizedKeyword) ||
        product.brand.toLowerCase().includes(normalizedKeyword),
    );
  }
  deleteProduct(id: Product['id']): void {
    this.products = this.products.filter((product) => product.id !== id);

    this.saveProducts();
  }

  private saveProducts(): void {
    this.storageService.setItem(this.storageKey, this.products);
  }

  getFilteredProducts(category: string, keyword: string): Product[] {
    let result = this.filterByCategory(category);

    const normalizedKeyword = keyword.trim().toLowerCase();

    if (normalizedKeyword) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedKeyword) ||
          product.description.toLowerCase().includes(normalizedKeyword) ||
          product.brand.toLowerCase().includes(normalizedKeyword),
      );
    }

    return result;
  }

  buyProduct(id: Product['id']): boolean {
    const product = this.products.find((item) => item.id === id);

    // Không tìm thấy sản phẩm hoặc đã hết hàng
    if (!product || product.stock <= 0) {
      return false;
    }

    // Trừ một sản phẩm
    this.products = this.products.map((item) =>
      item.id === id ? { ...item, stock: item.stock - 1 } : item,
    );

    // Lưu danh sách mới vào localStorage
    this.saveProducts();

    return true;
  }
}
