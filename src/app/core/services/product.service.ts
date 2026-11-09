import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { Product, ProductCategory } from '../model/product.model';
import { PaginatedResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';
  // Thêm hằng số key lưu trữ
  private readonly LOCAL_PRODUCTS_KEY = 'shophub_local_products';

  /**
   * Đọc danh sách sản phẩm do người dùng tự tạo từ localStorage
   */
  private getLocalProducts(): Product[] {
    const data = localStorage.getItem(this.LOCAL_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Lưu sản phẩm mới tạo vào đầu danh sách trong localStorage
   */
  private saveLocalProduct(product: Product): void {
    const current = this.getLocalProducts();
    // Đưa sản phẩm mới lên đầu mảng
    const updated = [product, ...current];
    localStorage.setItem(this.LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  }
  /**
   * Lấy danh sách sản phẩm có phân trang từ DummyJSON API
   * @param page Số trang hiện tại (bắt đầu từ 1)
   * @param limit Số lượng sản phẩm mỗi trang
   */
  getProducts(page: number = 1, limit: number = 8): Observable<PaginatedResponse<Product>> {
    const skip = Math.max(0, (page - 1) * limit);
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params }).pipe(
      map((res) => {
        // Khi ở trang 1, chèn sản phẩm mới tạo lên đầu danh sách
        if (page === 1) {
          const local = this.getLocalProducts();
          return {
            ...res,
            products: [...local, ...res.products],
            total: res.total + local.length,
          };
        }
        return res;
      })
    );
  }

  /**
   * Lấy thông tin chi tiết một sản phẩm theo ID
   * @param id ID của sản phẩm
   */
  getProductById(id: number | string): Observable<Product> {
    const localList = this.getLocalProducts();
    const localProduct = localList.find((p) => String(p.id) === String(id));

    if (localProduct) {
      return of(localProduct);
    }

    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tìm kiếm sản phẩm server-side theo từ khóa có hỗ trợ phân trang
   * @param keyword Từ khóa tìm kiếm
   * @param page Số trang hiện tại
   * @param limit Số lượng sản phẩm mỗi trang
   */
  searchProducts(
    keyword: string,
    page: number = 1,
    limit: number = 8,
  ): Observable<PaginatedResponse<Product>> {
    const skip = Math.max(0, (page - 1) * limit);
    const params = new HttpParams()
      .set('q', keyword.trim())
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/search`, { params }).pipe(
      map((res) => {
        const localList = this.getLocalProducts();
        const searchKey = keyword.trim().toLowerCase();

        const matchedProducts = localList.filter((p) => p.title.toLowerCase().includes(searchKey));
        if (page === 1) {
          return {
            ...res, // Giữ nguyên các thuộc tính khác của server (skip, limit...)
            products: [...matchedProducts, ...res.products], // Đưa hàng local lên trước
            total: res.total + matchedProducts.length, // Cộng thêm số lượng vào tổng
          };
        }
        return res;
      })

    )
  }

  /**
   * Lọc sản phẩm theo danh mục từ API
   * @param category Slug của danh mục (ví dụ 'smartphones', 'laptops')
   * @param page Số trang hiện tại
   * @param limit Số lượng sản phẩm mỗi trang
   */
  getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 8,
  ): Observable<PaginatedResponse<Product>> {
    const skip = Math.max(0, (page - 1) * limit);
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/category/${encodeURIComponent(category)}`,
      { params },
    ).pipe(map((res) => {
      const localList = this.getLocalProducts();

      const categories = category.trim().toLowerCase();

      const matchedProducts = localList.filter((p) => p.category.toLowerCase().includes(categories));
      if (page === 1) {
        return {
          ...res,
          products: [...matchedProducts, ...res.products],
          total: res.total + matchedProducts.length,
        };
      }
      return res;
    }))
  }

  /**
   * Lấy danh sách toàn bộ danh mục sản phẩm từ DummyJSON (bao gồm slug và name)
   */
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Lấy danh sách tên/slug danh mục dạng mảng string
   */
  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/category-list`);
  }

  /**
   * Thêm sản phẩm mới qua API POST
   * @param product Dữ liệu sản phẩm mới
   */
  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product).pipe(
      tap((createdProduct) => {
        this.saveLocalProduct(createdProduct);
      })
    );
  }

  /**
   * Xóa sản phẩm qua API DELETE
   * @param id ID của sản phẩm cần xóa
   */
  deleteProduct(id: number | string): Observable<Product & { isDeleted?: boolean; deletedOn?: string }> {
    return this.http.delete<Product & { isDeleted?: boolean; deletedOn?: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}
